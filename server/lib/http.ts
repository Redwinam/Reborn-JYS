import { ApiError } from "./errors.js";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {}),
    },
  });
}

export function jsonError(message: string, status = 500, init: ResponseInit = {}) {
  return json(
    { error: message },
    {
      ...init,
      status,
    }
  );
}

export async function handleApi(handler: () => Promise<Response> | Response) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      if (!error.expose) {
        console.error(error);
        return jsonError("服务端暂时不可用，请稍后重试", error.status);
      }

      return jsonError(error.message, error.status);
    }

    console.error(error);
    return jsonError("服务端暂时不可用，请稍后重试", 500);
  }
}

export async function readJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "请求数据格式错误");
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parsePositiveInt(value: unknown, fieldName = "id") {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(422, `${fieldName} 无效`);
  }

  return parsed;
}

export function getRouteId(request: Request, fieldName = "id") {
  const pathname = new URL(request.url).pathname;
  const id = pathname.split("/").filter(Boolean).pop();
  return parsePositiveInt(id, fieldName);
}

export function methodNotAllowed(allowedMethods: string[]) {
  return jsonError("请求方法不支持", 405, {
    headers: {
      Allow: allowedMethods.join(", "),
    },
  });
}
