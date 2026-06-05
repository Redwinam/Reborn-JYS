import { ApiError } from "../../server/lib/errors";
import { getRouteId, handleApi, isRecord, json, methodNotAllowed, readJsonBody } from "../../server/lib/http";
import { PlayerModel, sameEmail } from "../../server/lib/models";
import { parseOptionalBoolean, validateEmail, validatePlayerName } from "../../server/lib/validators";

interface PlayerUpdateBody {
  player?: {
    id?: unknown;
    name?: unknown;
    email?: unknown;
    anonymous?: unknown;
  };
  update?: unknown;
}

export async function PUT(request: Request) {
  return handleApi(async () => {
    const id = getRouteId(request, "玩家 id");
    const body = await readJsonBody<PlayerUpdateBody>(request);

    if (!isRecord(body.player)) {
      throw new ApiError(422, "玩家信息不能为空");
    }

    const email = validateEmail(body.player.email);
    const currentPlayer = await PlayerModel.getWithPlays(id);

    if (!currentPlayer || !sameEmail(currentPlayer.email, email)) {
      throw new ApiError(422, "更新失败，邮箱与玩家数据库信息不匹配，请尝试退出并重新连接账号");
    }

    if (body.player.id !== undefined && Number(body.player.id) !== id) {
      throw new ApiError(422, "更新失败，玩家 id 不匹配");
    }

    if (body.update !== true) {
      return json(currentPlayer);
    }

    const updatedPlayer = await PlayerModel.update(id, {
      name: body.player.name === undefined ? currentPlayer.name : validatePlayerName(body.player.name),
      anonymous: parseOptionalBoolean(body.player.anonymous, currentPlayer.anonymous),
    });

    if (!updatedPlayer) {
      throw new ApiError(404, "玩家不存在");
    }

    return json(await PlayerModel.getWithPlays(updatedPlayer.id));
  });
}

export async function GET() {
  return methodNotAllowed(["PUT"]);
}

export async function DELETE() {
  return methodNotAllowed(["PUT"]);
}
