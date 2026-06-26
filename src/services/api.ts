import axios from "axios";
import { API_BASE_URL } from "../config/api";
import type { Play, PlayerResponse } from "../../shared/types";

/** 从 axios 错误中提取后端返回的 error 文案，拿不到则回退到 fallback。 */
export function extractApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export const playerApi = {
  /** 连接/创建玩家。POST /players */
  async link(player: { name: string; email: string; anonymous: boolean }): Promise<PlayerResponse> {
    const res = await axios.post<PlayerResponse>(`${API_BASE_URL}/players`, { player });
    return res.data;
  },

  /** 更新玩家昵称/匿名设置。PUT /players/:id (update=true) */
  async update(id: number, player: { name: string; email: string; anonymous: boolean }): Promise<PlayerResponse> {
    const res = await axios.put<PlayerResponse>(`${API_BASE_URL}/players/${id}`, { player, update: true });
    return res.data;
  },

  /** 拉取玩家最新信息与存档列表。PUT /players/:id (update=false) */
  async refresh(id: number, email: string): Promise<PlayerResponse> {
    const res = await axios.put<PlayerResponse>(`${API_BASE_URL}/players/${id}`, { player: { id, email }, update: false });
    return res.data;
  },
};

export const playApi = {
  /** 保存当前存档。POST /plays，返回更新后的玩家（含存档列表）。 */
  async save(player: { name: string; email: string }, play: { player_id: number; state: unknown }): Promise<PlayerResponse> {
    const res = await axios.post<PlayerResponse>(`${API_BASE_URL}/plays`, { player, play });
    return res.data;
  },

  /** 读取指定存档（含完整 state）。GET /plays/:id */
  async load(id: number, playerId: number, email: string): Promise<Play> {
    const res = await axios.get<Play>(`${API_BASE_URL}/plays/${id}`, { params: { playerId, email } });
    return res.data;
  },

  /** 删除指定存档。DELETE /plays/:id，返回更新后的玩家。 */
  async remove(id: number, player: { id: number; email: string }): Promise<PlayerResponse> {
    const res = await axios.delete<PlayerResponse>(`${API_BASE_URL}/plays/${id}`, { data: { player } });
    return res.data;
  },
};
