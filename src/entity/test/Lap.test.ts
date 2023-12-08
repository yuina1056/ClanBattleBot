import Lap from "@/entity/Lap";

describe("isAttackPossible", () => {
  test("全てのボスに攻撃可能", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 1;
    lap.boss2Lap = 1;
    lap.boss3Lap = 1;
    lap.boss4Lap = 1;
    lap.boss5Lap = 1;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(true);
    expect(lap.isAttackPossible(3)).toBe(true);
    expect(lap.isAttackPossible(4)).toBe(true);
    expect(lap.isAttackPossible(5)).toBe(true);
  });
  test("1周差ボスには攻撃可能", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 1;
    lap.boss2Lap = 2;
    lap.boss3Lap = 2;
    lap.boss4Lap = 2;
    lap.boss5Lap = 2;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(true);
    expect(lap.isAttackPossible(3)).toBe(true);
    expect(lap.isAttackPossible(4)).toBe(true);
    expect(lap.isAttackPossible(5)).toBe(true);
  });
  test("2周差のボスには攻撃不可能", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 1;
    lap.boss2Lap = 2;
    lap.boss3Lap = 2;
    lap.boss4Lap = 2;
    lap.boss5Lap = 3;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(true);
    expect(lap.isAttackPossible(3)).toBe(true);
    expect(lap.isAttackPossible(4)).toBe(true);
    expect(lap.isAttackPossible(5)).toBe(false);
  });
  test("3段階をまたぐボスには攻撃不可能", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 5;
    lap.boss2Lap = 6;
    lap.boss3Lap = 6;
    lap.boss4Lap = 6;
    lap.boss5Lap = 6;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(false);
    expect(lap.isAttackPossible(3)).toBe(false);
    expect(lap.isAttackPossible(4)).toBe(false);
    expect(lap.isAttackPossible(5)).toBe(false);
  });
  test("3段階をまたぐボスには攻撃不可能(複数)", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 5;
    lap.boss2Lap = 6;
    lap.boss3Lap = 5;
    lap.boss4Lap = 6;
    lap.boss5Lap = 6;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(false);
    expect(lap.isAttackPossible(3)).toBe(true);
    expect(lap.isAttackPossible(4)).toBe(false);
    expect(lap.isAttackPossible(5)).toBe(false);
  });
  test("4段階をまたぐボスには攻撃不可能", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 21;
    lap.boss2Lap = 22;
    lap.boss3Lap = 22;
    lap.boss4Lap = 22;
    lap.boss5Lap = 22;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(false);
    expect(lap.isAttackPossible(3)).toBe(false);
    expect(lap.isAttackPossible(4)).toBe(false);
    expect(lap.isAttackPossible(5)).toBe(false);
  });
  test("4段階をまたぐボスには攻撃不可能(複数)", () => {
    const lap = new Lap(1, 1);
    lap.boss1Lap = 21;
    lap.boss2Lap = 22;
    lap.boss3Lap = 22;
    lap.boss4Lap = 21;
    lap.boss5Lap = 22;
    expect(lap.isAttackPossible(1)).toBe(true);
    expect(lap.isAttackPossible(2)).toBe(false);
    expect(lap.isAttackPossible(3)).toBe(false);
    expect(lap.isAttackPossible(4)).toBe(true);
    expect(lap.isAttackPossible(5)).toBe(false);
  });
});
