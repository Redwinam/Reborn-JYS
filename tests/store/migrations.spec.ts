import { describe, expect, it } from "vitest";
import { migrateV1toV2 } from "../../src/store/migrations";
import golden from "../fixtures/golden-save.json";

// Phase 3b：扁平 v1 存档 → 命名空间 module v2 嵌套结构。
// 这是把存档迁移到 module 化 store 的回归基线：字段必须落到正确的 module 下、不丢失。
describe("migrateV1toV2", () => {
  it("把扁平存档映射为嵌套 module 结构，关键字段不丢失", () => {
    const v2 = migrateV1toV2(golden) as any;

    expect(v2.version).toBe(2);
    expect(v2.player).toBe(golden.player);

    // gameLoop
    expect(v2.gameLoop.term).toBe(golden.term);
    expect(v2.gameLoop.round).toBe(golden.round);
    expect(v2.gameLoop.year).toBe(golden.year);

    // character
    expect(v2.character.attributes.money).toBe(golden.attributes.money);
    expect(v2.character.attributes.skill.freestyleLevel).toBe(golden.attributes.skill.freestyleLevel);

    // relationship
    expect(v2.relationship.breakupTimes).toBe(golden.breakupTimes);
    expect(v2.relationship.girlfriend.type).toBe(golden.girlfriend.type);

    // progress
    expect(v2.progress.inventory["皮卡丘玩偶"].quantity).toBe(golden.inventory["皮卡丘玩偶"].quantity);
    expect(v2.progress.songStages["浪漫主义"].completedStage).toBe("release");

    // business
    expect(v2.business.signedAgency).toBe(golden.signedAgency);
    expect(v2.business.investedProjects).toEqual(golden.investedProjects);
  });

  it("对空输入也能给出完整的 v2 骨架", () => {
    const v2 = migrateV1toV2({} as any) as any;
    expect(v2.version).toBe(2);
    expect(v2.player).toBeNull();
    expect(v2.gameLoop).toBeDefined();
    expect(v2.character).toBeDefined();
    expect(v2.relationship).toBeDefined();
    expect(v2.progress).toBeDefined();
    expect(v2.business).toBeDefined();
  });
});
