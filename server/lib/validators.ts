import { ApiError } from "./errors";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const controlCharactersPattern = /[\u0000-\u001f\u007f]/;

export function validatePlayerName(value: unknown) {
  if (typeof value !== "string") {
    throw new ApiError(422, "昵称不能为空");
  }

  const name = value.trim();

  if (!name) {
    throw new ApiError(422, "昵称不能为空");
  }

  if (name.length > 40) {
    throw new ApiError(422, "昵称最多 40 个字符");
  }

  if (controlCharactersPattern.test(name)) {
    throw new ApiError(422, "昵称包含无效字符");
  }

  return name;
}

export function validateEmail(value: unknown) {
  if (typeof value !== "string") {
    throw new ApiError(422, "邮箱不能为空");
  }

  const email = value.trim();

  if (!email) {
    throw new ApiError(422, "邮箱不能为空");
  }

  if (email.length > 254 || !emailPattern.test(email)) {
    throw new ApiError(422, "邮箱格式不正确");
  }

  return email;
}

export function parseOptionalBoolean(value: unknown, fallback = false) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  throw new ApiError(422, "匿名设置无效");
}
