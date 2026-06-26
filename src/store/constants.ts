// 集中管理跨多处复用的游戏数值常量，替换散落在 store 中的魔法数字。
// Phase 1：先收敛被特征化测试覆盖的 store 级常量；其余散落字面量（动作文件中的价格、
// RNG 阈值、周目衰减系数等）在后续阶段补测试后再逐步迁移到这里。

// —— 经济 ——
/** 每根金条的买卖价（金钱）。同时被 PopupSubGold 复用。 */
export const GOLD_PRICE = 552;
/** 每回合金条产生的利息率。 */
export const GOLD_INTEREST_RATE = 0.06;
/** 签约公司后正向收入的入账比例（二八分，只入账 20%）。 */
export const AGENCY_INCOME_RATE = 0.2;

// —— 时间 ——
/** 游戏起始年份。 */
export const START_YEAR = 2012;
/** 每年的回合数。 */
export const ROUNDS_PER_YEAR = 36;

// —— 物品 ——
/** 特殊装备：库存至多 1 件，不可叠加。 */
export const SPECIAL_ITEMS = ["麦克风大锤", "恶魔「S」之链", "反穿之甲", "虚无之裤", "黄色卡车", "巴黎之靴"] as const;
