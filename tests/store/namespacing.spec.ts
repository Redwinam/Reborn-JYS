import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import { store } from "../../src/store";

// Phase 3b 命名空间「接线」回归护栏。
// commit 字符串 Vuex 无法做类型检查，且未知 type 是【静默 no-op】（仅 dev console.error，
// 生产环境无任何信号）。这里断言供给侧正确：每个局部 mutation 注册在正确的 module 命名空间
// 下、且不再以裸名存在于 root；跨域 mutation 仍以裸名留在 root。若将来误把 mutation 移动到
// 别的 module、或在 module 定义里漏标 namespaced，这里会立刻报警。
const NAMESPACED_MUTATIONS = [
  "gameLoop/incrementLyricIndex",
  "character/addSleepHours",
  "character/upgradeSkillLevel",
  "character/setWeak",
  "character/updateDrunk",
  "character/buyGold",
  "relationship/incrementFlirtCount",
  "relationship/resetFlirtCount",
  "relationship/resetRelationRound",
  "relationship/setSeamlessRelation",
  "relationship/incrementAccompanyCount",
  "relationship/resetAccompanyCount",
  "progress/incrementUndergroundCount",
  "progress/incrementTourCount",
  "progress/updateBattleResult",
  "progress/updateBattleEnd",
  "progress/updateItem",
  "progress/packFood",
  "progress/decreaseInventory",
  "progress/addHappenedEvent",
  "progress/unlockSong",
  "progress/setSongStages",
  "progress/unlockFeiSong",
  "progress/unlockVitamin",
  "progress/collectShard",
  "business/incrementGoToAgencyTimes",
  "business/openFengyan",
  "business/initArtist",
  "business/resetThisSeasonArtist",
  "ui/set", // Phase 3c：gameRefs 门面经此通用 setter 写 ui 状态
];

// 跨域 mutation：读写多个 module，保留在 root（调用不加前缀）。
const ROOT_MUTATIONS = [
  "incrementRound",
  "updateAttribute",
  "setGirlfriend",
  "setSignedAgency",
  "unlockFood",
  "recruitArtist",
  "trainArtist",
  "dispatchArtist",
  "unlockAchievement",
  "unlockAchievementCondition",
  "investProject",
  "addTextToHistory",
  "setGameEnded",
  "resetGameState",
  "loadGameState",
  "setPlayer",
  "resetGame",
];

// Vuex 4 把所有 mutation 扁平注册进 store._mutations，命名空间 mutation 的 key 形如
// "progress/updateItem"，root mutation 为裸名。
const registeredMutations = () => Object.keys((store as unknown as { _mutations: Record<string, unknown> })._mutations);

describe("Phase 3b 命名空间 store 接线", () => {
  it("每个局部 mutation 注册在其 module 命名空间下", () => {
    const keys = registeredMutations();
    for (const type of NAMESPACED_MUTATIONS) {
      expect(keys).toContain(type);
    }
  });

  it("局部 mutation 不再以裸名存在于 root（确认确实被命名空间化）", () => {
    const keys = registeredMutations();
    for (const type of NAMESPACED_MUTATIONS) {
      const bareName = type.split("/")[1];
      expect(keys).not.toContain(bareName);
    }
  });

  it("跨域 mutation 仍以裸名留在 root", () => {
    const keys = registeredMutations();
    for (const type of ROOT_MUTATIONS) {
      expect(keys).toContain(type);
    }
  });

  it("6 个领域 module 都已注册", () => {
    for (const m of ["gameLoop", "character", "relationship", "progress", "business", "ui"]) {
      expect(store.hasModule(m)).toBe(true);
    }
  });
});

// ---- 调用点（需求侧）静态扫描 ----
// commit/dispatch 的 type 字符串 Vuex 不做类型检查，错误前缀=静默 no-op。组件无自动化运行时
// 覆盖，故这里静态扫描 src 下所有 .ts/.vue 里的 commit("…")/dispatch("…") 字面量，断言每个 type
// 都能解析到一个已注册的 mutation/action。任一调用点（含全部组件）写错 module/ 前缀都会报警。
function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) collectSourceFiles(full, acc);
    else if (/\.(ts|vue)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

type CallSite = { file: string; line: number; kind: "commit" | "dispatch"; type: string };

function extractCallSites(): CallSite[] {
  const sites: CallSite[] = [];
  const callRe = /\.(commit|dispatch)\(\s*["']([^"'\s]+)["']/g;
  for (const file of collectSourceFiles(resolve(process.cwd(), "src"))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      let match: RegExpExecArray | null;
      callRe.lastIndex = 0;
      while ((match = callRe.exec(line)) !== null) {
        const commentAt = line.indexOf("//");
        if (commentAt !== -1 && commentAt < match.index) continue; // 跳过行注释里的调用
        sites.push({ file: file.replace(process.cwd() + "/", ""), line: i + 1, kind: match[1] as "commit" | "dispatch", type: match[2] });
      }
    });
  }
  return sites;
}

describe("Phase 3b 调用点前缀完整性（静态扫描 src）", () => {
  const sites = extractCallSites();
  const mutationTypes = new Set(Object.keys((store as unknown as { _mutations: Record<string, unknown> })._mutations));
  const actionTypes = new Set(Object.keys((store as unknown as { _actions: Record<string, unknown> })._actions));

  it("扫描确实采集到了调用点（防止正则失效导致空测）", () => {
    expect(sites.length).toBeGreaterThan(100);
  });

  it("每个 commit(\"…\") 的 type 都已注册（含组件，捕获错误的 module/ 前缀）", () => {
    const unknown = sites.filter((s) => s.kind === "commit" && !mutationTypes.has(s.type)).map((s) => `${s.file}:${s.line} commit('${s.type}')`);
    expect(unknown).toEqual([]);
  });

  it("每个 dispatch(\"…\") 的 type 都已注册（action 均在 root）", () => {
    const unknown = sites.filter((s) => s.kind === "dispatch" && !actionTypes.has(s.type)).map((s) => `${s.file}:${s.line} dispatch('${s.type}')`);
    expect(unknown).toEqual([]);
  });
});
