import { ApiError } from "./errors";
import { generateId, getCurrentTimestamp, getRedis } from "./redis";

const maxPlaysPerPlayer = 99;
const inlineStateMaxBytes = 750_000;
const stateChunkCharLength = 200_000;
const maxStateBytes = 5_000_000;

export interface Player {
  id: number;
  name: string;
  email: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Play {
  id: number;
  playerId: number;
  state: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerResponse extends Player {
  plays: Array<{
    id: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface StateMeta {
  chunked: boolean;
  chunks: number;
  totalSize: number;
}

function emailLookupKey(email: string) {
  return email.trim().toLowerCase();
}

export function sameEmail(left: string, right: string) {
  return emailLookupKey(left) === emailLookupKey(right);
}

function isPlay(value: Play | null): value is Play {
  return value !== null;
}

function measureJsonBytes(value: unknown) {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

function assertStateSize(state: unknown) {
  if (measureJsonBytes(state) > maxStateBytes) {
    throw new ApiError(422, "存档数据过大，请删除部分历史内容后再保存");
  }
}

export const PlayerModel = {
  async getAllNonAnonymous(): Promise<string[]> {
    const redis = getRedis();
    const playerIds = await redis.smembers<Array<string | number>>("players:all");

    if (!playerIds || playerIds.length === 0) {
      return [];
    }

    const players = await redis.mget<Player[]>(playerIds.map((id) => `players:${id}`));

    return players.reduce<string[]>((names, player) => {
      if (player && !player.anonymous) {
        names.push(player.name);
      }

      return names;
    }, []);
  },

  async getById(id: number): Promise<Player | null> {
    return await getRedis().get<Player>(`players:${id}`);
  },

  async getByEmail(email: string): Promise<Player | null> {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return null;
    }

    const redis = getRedis();
    const lookupKeys = Array.from(new Set([trimmedEmail, emailLookupKey(trimmedEmail)]));

    for (const key of lookupKeys) {
      const id = await redis.get<number>(`players:email:${key}`);
      if (id) {
        return await this.getById(id);
      }
    }

    return null;
  },

  async create(data: { name: string; email: string; anonymous?: boolean }): Promise<Player> {
    const redis = getRedis();
    const id = await generateId("counter:player");
    const now = getCurrentTimestamp();
    const email = data.email.trim();

    const player: Player = {
      id,
      name: data.name.trim(),
      email,
      anonymous: data.anonymous || false,
      createdAt: now,
      updatedAt: now,
    };

    await redis.set(`players:${id}`, player);
    await redis.set(`players:email:${email}`, id);

    const lookupEmail = emailLookupKey(email);
    if (lookupEmail !== email) {
      await redis.set(`players:email:${lookupEmail}`, id);
    }

    if (!player.anonymous) {
      await redis.sadd("players:all", id);
    }

    return player;
  },

  async update(id: number, data: Partial<Pick<Player, "name" | "anonymous">>): Promise<Player | null> {
    const redis = getRedis();
    const player = await this.getById(id);
    if (!player) return null;

    const updatedPlayer: Player = {
      ...player,
      ...data,
      updatedAt: getCurrentTimestamp(),
    };

    await redis.set(`players:${id}`, updatedPlayer);

    if (player.anonymous !== updatedPlayer.anonymous) {
      if (updatedPlayer.anonymous) {
        await redis.srem("players:all", id);
      } else {
        await redis.sadd("players:all", id);
      }
    }

    return updatedPlayer;
  },

  async getWithPlays(id: number, limit = maxPlaysPerPlayer): Promise<PlayerResponse | null> {
    const redis = getRedis();
    const player = await this.getById(id);
    if (!player) return null;

    const playIds = await redis.lrange<number>(`plays:player:${id}`, 0, limit - 1);

    if (!playIds || playIds.length === 0) {
      return {
        ...player,
        plays: [],
      };
    }

    const plays = await redis.mget<Play[]>(playIds.map((playId) => `plays:${playId}`));

    return {
      ...player,
      plays: plays.filter(isPlay).map((play) => ({
        id: play.id,
        createdAt: play.createdAt,
        updatedAt: play.updatedAt,
      })),
    };
  },
};

export const PlayModel = {
  async countByPlayerId(playerId: number): Promise<number> {
    return await getRedis().llen(`plays:player:${playerId}`);
  },

  async getMetadataById(id: number): Promise<Play | null> {
    return await getRedis().get<Play>(`plays:${id}`);
  },

  async getById(id: number): Promise<Play | null> {
    const play = await this.getMetadataById(id);
    if (!play) return null;

    return {
      ...play,
      state: await this.getStateById(id),
    };
  },

  async getStateById(id: number): Promise<unknown> {
    const redis = getRedis();
    const meta = await redis.get<StateMeta>(`plays:${id}:meta`);

    if (meta && meta.chunked) {
      let fullState = "";

      for (let i = 0; i < meta.chunks; i += 1) {
        const chunk = await redis.get<string>(`plays:${id}:chunk:${i}`);
        if (chunk) fullState += chunk;
      }

      try {
        return JSON.parse(fullState);
      } catch (error) {
        console.error(`解析游戏记录 ID:${id} 的 state 失败`, error);
        return {};
      }
    }

    return (await redis.get<unknown>(`plays:${id}:state`)) || {};
  },

  async create(data: { playerId: number; state: unknown }): Promise<Play> {
    const playCount = await this.countByPlayerId(data.playerId);

    if (playCount >= maxPlaysPerPlayer) {
      throw new ApiError(422, "当前玩家存档已达 99 条，请删除旧存档后再保存");
    }

    const redis = getRedis();
    const id = await generateId("counter:play");
    const now = getCurrentTimestamp();
    const state = this.cleanState(data.state);
    assertStateSize(state);

    const play: Play = {
      id,
      playerId: data.playerId,
      state: {},
      createdAt: now,
      updatedAt: now,
    };

    await redis.set(`plays:${id}`, play);
    await this.saveState(id, state);
    await redis.lpush(`plays:player:${data.playerId}`, id);

    return {
      ...play,
      state,
    };
  },

  async saveState(playId: number, state: unknown): Promise<void> {
    const redis = getRedis();
    const stateString = JSON.stringify(state);
    const sizeInBytes = measureJsonBytes(state);

    if (sizeInBytes > maxStateBytes) {
      throw new ApiError(422, "存档数据过大，请删除部分历史内容后再保存");
    }

    if (sizeInBytes > inlineStateMaxBytes) {
      const chunks = Math.ceil(stateString.length / stateChunkCharLength);

      await redis.set(`plays:${playId}:meta`, {
        chunked: true,
        chunks,
        totalSize: sizeInBytes,
      });

      for (let i = 0; i < chunks; i += 1) {
        const start = i * stateChunkCharLength;
        const end = Math.min((i + 1) * stateChunkCharLength, stateString.length);
        await redis.set(`plays:${playId}:chunk:${i}`, stateString.substring(start, end));
      }

      return;
    }

    await redis.set(`plays:${playId}:state`, state);
  },

  async delete(id: number): Promise<Play | null> {
    const redis = getRedis();
    const play = await this.getMetadataById(id);
    if (!play) return null;

    await redis.del(`plays:${id}`);

    const meta = await redis.get<StateMeta>(`plays:${id}:meta`);
    if (meta && meta.chunked) {
      for (let i = 0; i < meta.chunks; i += 1) {
        await redis.del(`plays:${id}:chunk:${i}`);
      }

      await redis.del(`plays:${id}:meta`);
    } else {
      await redis.del(`plays:${id}:state`);
    }

    await redis.lrem(`plays:player:${play.playerId}`, 0, id);

    return play;
  },

  cleanState(state: unknown): unknown {
    if (!state || typeof state !== "object") return state;

    const cleanedState = JSON.parse(JSON.stringify(state)) as Record<string, unknown>;

    delete cleanedState.player;
    delete cleanedState.plays;
    delete cleanedState.textHistory;

    const playerState = cleanedState.playerState;
    if (playerState && typeof playerState === "object" && !Array.isArray(playerState)) {
      delete (playerState as Record<string, unknown>).plays;
    }

    return cleanedState;
  },
};
