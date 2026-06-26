import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { API_BASE_URL } from "../../src/config/api";
import { playerApi, playApi, extractApiError } from "../../src/services/api";

// 通过 spy 拦截 axios，锁定 6 个调用的 URL 与 payload 契约。
afterEach(() => {
  vi.restoreAllMocks();
});

describe("playerApi", () => {
  it("link 调 POST /players 并返回 data", async () => {
    const data = { id: 1, plays: [] };
    const post = vi.spyOn(axios, "post").mockResolvedValue({ data });
    const result = await playerApi.link({ name: "a", email: "e@x.com", anonymous: false });
    expect(post).toHaveBeenCalledWith(`${API_BASE_URL}/players`, { player: { name: "a", email: "e@x.com", anonymous: false } });
    expect(result).toBe(data);
  });

  it("update 调 PUT /players/:id 带 update:true", async () => {
    const put = vi.spyOn(axios, "put").mockResolvedValue({ data: {} });
    await playerApi.update(7, { name: "n", email: "e@x.com", anonymous: true });
    expect(put).toHaveBeenCalledWith(`${API_BASE_URL}/players/7`, { player: { name: "n", email: "e@x.com", anonymous: true }, update: true });
  });

  it("refresh 调 PUT /players/:id 带 update:false", async () => {
    const put = vi.spyOn(axios, "put").mockResolvedValue({ data: {} });
    await playerApi.refresh(7, "e@x.com");
    expect(put).toHaveBeenCalledWith(`${API_BASE_URL}/players/7`, { player: { id: 7, email: "e@x.com" }, update: false });
  });
});

describe("playApi", () => {
  it("save 调 POST /plays 带 player 与 play", async () => {
    const post = vi.spyOn(axios, "post").mockResolvedValue({ data: {} });
    await playApi.save({ name: "n", email: "e@x.com" }, { player_id: 3, state: { round: 1 } });
    expect(post).toHaveBeenCalledWith(`${API_BASE_URL}/plays`, { player: { name: "n", email: "e@x.com" }, play: { player_id: 3, state: { round: 1 } } });
  });

  it("load 调 GET /plays/:id 带 params", async () => {
    const get = vi.spyOn(axios, "get").mockResolvedValue({ data: { state: {} } });
    await playApi.load(5, 3, "e@x.com");
    expect(get).toHaveBeenCalledWith(`${API_BASE_URL}/plays/5`, { params: { playerId: 3, email: "e@x.com" } });
  });

  it("remove 调 DELETE /plays/:id 带 player body", async () => {
    const del = vi.spyOn(axios, "delete").mockResolvedValue({ data: {} });
    await playApi.remove(5, { id: 3, email: "e@x.com" });
    expect(del).toHaveBeenCalledWith(`${API_BASE_URL}/plays/5`, { data: { player: { id: 3, email: "e@x.com" } } });
  });
});

describe("extractApiError", () => {
  it("返回后端 error 文案", () => {
    const err = { isAxiosError: true, response: { data: { error: "邮箱不匹配" } } };
    expect(extractApiError(err, "fallback")).toBe("邮箱不匹配");
  });

  it("非 axios 错误回退到 fallback", () => {
    expect(extractApiError(new Error("x"), "fallback")).toBe("fallback");
  });
});
