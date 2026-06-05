import { ApiError } from "../server/lib/errors";
import { handleApi, isRecord, json, methodNotAllowed, parsePositiveInt, readJsonBody } from "../server/lib/http";
import { PlayerModel, PlayModel, sameEmail } from "../server/lib/models";
import { validateEmail } from "../server/lib/validators";

interface PlayCreateBody {
  play?: {
    player_id?: unknown;
    playerId?: unknown;
    state?: unknown;
  };
  player?: {
    email?: unknown;
  };
}

export async function POST(request: Request) {
  return handleApi(async () => {
    const body = await readJsonBody<PlayCreateBody>(request);

    if (!isRecord(body.play) || !isRecord(body.player)) {
      throw new ApiError(422, "存档数据不能为空");
    }

    const playerId = parsePositiveInt(body.play.player_id ?? body.play.playerId, "玩家 id");
    const email = validateEmail(body.player.email);
    const state = body.play.state;

    if (!isRecord(state)) {
      throw new ApiError(422, "存档数据格式错误");
    }

    const player = await PlayerModel.getById(playerId);
    if (!player || !sameEmail(player.email, email)) {
      throw new ApiError(422, "存档失败，邮箱与玩家数据库信息不匹配，请尝试退出并重新连接账号");
    }

    await PlayModel.create({
      playerId,
      state,
    });

    const updatedPlayer = await PlayerModel.getWithPlays(playerId);
    if (!updatedPlayer) {
      throw new ApiError(404, "玩家不存在");
    }

    return json(updatedPlayer, { status: 201 });
  });
}

export async function GET() {
  return methodNotAllowed(["POST"]);
}
