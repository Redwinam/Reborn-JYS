import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../src/store";
import { SkillLevelMapping } from "../../src/store/actions/upgradeSkill";

// 特征化测试：锁定核心 mutation 的当前行为，作为后续重构（尤其是拆分 store）的回归安全网。
// 每个用例前用 resetGame 回到全新一局的确定基线。
beforeEach(() => {
  store.commit("resetGame");
});

describe("incrementRound mutation", () => {
  it("推进回合并按 36 回合/年从 2012 推导游戏内年份", () => {
    expect(store.state.round).toBe(1);
    expect(store.state.year).toBe(2012);

    store.commit("incrementRound");
    expect(store.state.round).toBe(2);
    expect(store.state.year).toBe(2012);

    // 第 37 回合跨入第二年：floor((37-1)/36)+2012 = 2013
    while (store.state.round < 37) store.commit("incrementRound");
    expect(store.state.round).toBe(37);
    expect(store.state.year).toBe(2013);
  });

  it("把金条利息计入金钱：money += ceil(gold * 0.06 * 552)", () => {
    store.commit("updateAttribute", { attribute: "gold", value: 10 });
    const before = store.state.attributes.money;
    store.commit("incrementRound");
    expect(store.state.attributes.money).toBe(before + Math.ceil(10 * 0.06 * 552));
  });

  it("仅在恋爱中推进 relationRound", () => {
    store.commit("incrementRound");
    expect(store.state.relationRound).toBe(0);

    store.commit("setGirlfriend", { type: "学姐", effect: "charm", breakupReasons: [] });
    const before = store.state.relationRound;
    store.commit("incrementRound");
    expect(store.state.relationRound).toBe(before + 1);
  });
});

describe("updateAttribute mutation", () => {
  it("增加金钱并取整", () => {
    store.commit("updateAttribute", { attribute: "money", value: 100.6 });
    expect(store.state.attributes.money).toBe(101);
  });

  it("签约公司后正向收入二八分（只入账 20%）", () => {
    store.commit("setSignedAgency", true);
    store.commit("updateAttribute", { attribute: "money", value: 1000 });
    expect(store.state.attributes.money).toBe(200);
  });

  it("金钱为 NaN 时自我修复为 money=0、gold=2", () => {
    store.state.attributes.money = NaN;
    store.commit("updateAttribute", { attribute: "money", value: 50 });
    expect(store.state.attributes.money).toBe(0);
    expect(store.state.attributes.gold).toBe(2);
  });

  it("正向 popularity 计入红值", () => {
    store.commit("updateAttribute", { attribute: "popularity", value: 30 });
    expect(store.state.attributes.popularity.red).toBe(30);
  });

  it("red / black 直接调整时下限钳制为 0", () => {
    store.commit("updateAttribute", { attribute: "red", value: -5 });
    store.commit("updateAttribute", { attribute: "black", value: -5 });
    expect(store.state.attributes.popularity.red).toBe(0);
    expect(store.state.attributes.popularity.black).toBe(0);
  });

  it("游戏技能被当前等级段上限钳制（D 段上限 3）", () => {
    const dBand = SkillLevelMapping.find((l) => l.level === "D");
    store.commit("updateAttribute", { attribute: "gaming", value: 99 });
    expect(store.state.attributes.skill.gaming).toBe(dBand!.max);
  });

  it("体力上限钳制为 maxEnergy，低于 0 进入虚弱", () => {
    const maxEnergy = store.state.attributes.maxEnergy;
    store.commit("updateAttribute", { attribute: "energy", value: 9999 });
    expect(store.state.attributes.energy).toBe(maxEnergy);

    store.commit("updateAttribute", { attribute: "energy", value: -(maxEnergy + 5) });
    expect(store.state.attributes.energy).toBeLessThan(0);
    expect(store.state.weak).toBe(true);
  });
});

describe("buyGold mutation", () => {
  it("按 552/根 增加金条、扣减金钱", () => {
    store.commit("updateAttribute", { attribute: "money", value: 2000 });
    store.commit("buyGold", 2);
    expect(store.state.attributes.gold).toBe(2);
    expect(store.state.attributes.money).toBe(2000 - 552 * 2);
  });
});

describe("updateItem mutation", () => {
  it("普通物品按数量叠加", () => {
    store.commit("updateItem", { itemName: "皮卡丘玩偶", quantity: 5 });
    store.commit("updateItem", { itemName: "皮卡丘玩偶", quantity: 3 });
    expect(store.state.inventory["皮卡丘玩偶"].quantity).toBe(8);
  });

  it("特殊装备至多 1 件并记录 lastSpecialItem", () => {
    store.commit("updateItem", { itemName: "麦克风大锤", quantity: 1 });
    store.commit("updateItem", { itemName: "麦克风大锤", quantity: 1 });
    expect(store.state.inventory["麦克风大锤"].quantity).toBe(1);
    expect(store.state.lastSpecialItem).toBe("麦克风大锤");
  });
});

describe("upgradeSkillLevel mutation", () => {
  it("累加技能点并重算等级段（4 点 -> C 段）", () => {
    for (let i = 0; i < 4; i++) store.commit("upgradeSkillLevel", "freestyle");
    expect(store.state.attributes.skill.freestyle).toBe(4);
    expect(store.state.attributes.skill.freestyleLevel).toBe("C");
  });
});
