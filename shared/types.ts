// 前后端共享的玩家/存档契约类型。后端 server/lib/models.ts 与前端 src/store/player.ts
// 共同引用，避免两边各定义一份导致漂移（历史上出现过 createdAt/created_at、
// playerId/player_id、plays 列表项形状不一致等问题）。字段命名以后端实际返回为准（camelCase）。

export interface Player {
  id: number;
  name: string;
  email: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 玩家存档列表项：仅元数据，不含完整 state（玩家相关接口与存档写操作返回）。 */
export interface PlaySummary {
  id: number;
  createdAt: string;
  updatedAt: string;
}

/** 完整存档：含游戏 state（仅 GET /plays/:id 返回）。 */
export interface Play {
  id: number;
  playerId: number;
  state: unknown;
  createdAt: string;
  updatedAt: string;
}

/** 玩家信息 + 其存档列表，是玩家相关接口与存档写操作的统一响应体。 */
export interface PlayerResponse extends Player {
  plays: PlaySummary[];
}
