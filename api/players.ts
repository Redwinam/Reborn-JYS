import { ApiError } from "../server/lib/errors.js";
import { handleApi, isRecord, json, readJsonBody } from "../server/lib/http.js";
import { PlayerModel } from "../server/lib/models.js";
import { parseOptionalBoolean, validateEmail, validatePlayerName } from "../server/lib/validators.js";

interface PlayerCreateBody {
  player?: {
    name?: unknown;
    email?: unknown;
    anonymous?: unknown;
  };
}

export async function GET() {
  return handleApi(async () => {
    return json(await PlayerModel.getAllNonAnonymous());
  });
}

export async function POST(request: Request) {
  return handleApi(async () => {
    const body = await readJsonBody<PlayerCreateBody>(request);

    if (!isRecord(body.player)) {
      throw new ApiError(422, "玩家信息不能为空");
    }

    const name = validatePlayerName(body.player.name);
    const email = validateEmail(body.player.email);
    const anonymous = parseOptionalBoolean(body.player.anonymous, false);
    const existingPlayer = await PlayerModel.getByEmail(email);

    if (existingPlayer) {
      if (existingPlayer.name === name) {
        return json(await PlayerModel.getWithPlays(existingPlayer.id));
      }

      throw new ApiError(422, "连接失败，昵称与邮箱不匹配");
    }

    const player = await PlayerModel.create({
      name,
      email,
      anonymous,
    });

    return json(
      {
        ...player,
        plays: [],
      },
      { status: 201 }
    );
  });
}
