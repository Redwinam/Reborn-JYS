import { expect, vi } from "vitest";

// 组件测试通用工具。

// 静默并捕获 console.error，便于断言「没有未知 Vuex type」。
export function spyConsoleError() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

// Vuex 对未知 commit/dispatch type 是静默 no-op（仅 console.error）。这里把它变成断言失败，
// 用于兜住组件里写错的 module/ 前缀。
export function expectNoUnknownVuexType(errorSpy: ReturnType<typeof vi.spyOn>) {
  const offending = errorSpy.mock.calls
    .flat()
    .filter((m) => typeof m === "string" && (m.includes("unknown mutation type") || m.includes("unknown action type")));
  expect(offending).toEqual([]);
}
