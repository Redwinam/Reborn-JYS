import { ApiError } from "../../server/lib/errors.js";
import { getRouteId, handleApi, isRecord, json, methodNotAllowed, parsePositiveInt, readJsonBody } from "../../server/lib/http.js";
import { PlayerModel, PlayModel, sameEmail } from "../../server/lib/models.js";
import { validateEmail } from "../../server/lib/validators.js";

interface PlayDeleteBody {
  player?: {
    id?: unknown;
    email?: unknown;
  };
}

function readCredentialsFromUrl(request: Request) {
  const searchParams = new URL(request.url).searchParams;

  return {
    playerId: parsePositiveInt(searchParams.get("playerId"), "玩家 id"),
    email: validateEmail(searchParams.get("email")),
  };
}

async function ensurePlayOwner(playId: number, playerId: number, email: string) {
  const player = await PlayerModel.getById(playerId);

  if (!player || !sameEmail(player.email, email)) {
    throw new ApiError(422, "邮箱与玩家数据库信息不匹配，请尝试退出并重新连接账号");
  }

  const play = await PlayModel.getById(playId);
  if (!play || play.playerId !== playerId) {
    throw new ApiError(404, "存档不存在或无权访问");
  }

  return play;
}

export async function GET(request: Request) {
  return handleApi(async () => {
    const playId = getRouteId(request, "存档 id");
    const { playerId, email } = readCredentialsFromUrl(request);
    const play = await ensurePlayOwner(playId, playerId, email);

    return json(play);
  });
}

export async function DELETE(request: Request) {
  return handleApi(async () => {
    const playId = getRouteId(request, "存档 id");
    const body = await readJsonBody<PlayDeleteBody>(request);

    if (!isRecord(body.player)) {
      throw new ApiError(422, "玩家信息不能为空");
    }

    const playerId = parsePositiveInt(body.player.id, "玩家 id");
    const email = validateEmail(body.player.email);
    await ensurePlayOwner(playId, playerId, email);
    await PlayModel.delete(playId);

    const updatedPlayer = await PlayerModel.getWithPlays(playerId);
    if (!updatedPlayer) {
      throw new ApiError(404, "玩家不存在");
    }

    return json(updatedPlayer);
  });
}

export async function POST() {
  return methodNotAllowed(["GET", "DELETE"]);
}

export async function PUT() {
  return methodNotAllowed(["GET", "DELETE"]);
}
