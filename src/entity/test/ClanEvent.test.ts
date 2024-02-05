import ClanEvent from "@/entity/ClanEvent";

describe("isAttackPossible", () => {
  test("全てのボスに攻撃可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 1;
    clanEvent.boss2Lap = 1;
    clanEvent.boss3Lap = 1;
    clanEvent.boss4Lap = 1;
    clanEvent.boss5Lap = 1;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(true);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(true);
  });
  test("1周差ボスには攻撃可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 1;
    clanEvent.boss2Lap = 2;
    clanEvent.boss3Lap = 2;
    clanEvent.boss4Lap = 2;
    clanEvent.boss5Lap = 2;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(true);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(true);
  });
  test("2周差のボスには攻撃不可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 1;
    clanEvent.boss2Lap = 2;
    clanEvent.boss3Lap = 2;
    clanEvent.boss4Lap = 2;
    clanEvent.boss5Lap = 3;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(true);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(false);
  });
  test("3段階をまたぐボスには攻撃不可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 6;
    clanEvent.boss2Lap = 7;
    clanEvent.boss3Lap = 7;
    clanEvent.boss4Lap = 7;
    clanEvent.boss5Lap = 7;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(false);
    expect(clanEvent.isAttackPossible(3)).toBe(false);
    expect(clanEvent.isAttackPossible(4)).toBe(false);
    expect(clanEvent.isAttackPossible(5)).toBe(false);
  });
  test("3段階をまたぐボスには攻撃不可能(複数)", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 6;
    clanEvent.boss2Lap = 7;
    clanEvent.boss3Lap = 6;
    clanEvent.boss4Lap = 7;
    clanEvent.boss5Lap = 7;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(false);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(false);
    expect(clanEvent.isAttackPossible(5)).toBe(false);
  });
  test("すべてのボスが3段階に到達したら攻撃可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 7;
    clanEvent.boss2Lap = 7;
    clanEvent.boss3Lap = 7;
    clanEvent.boss4Lap = 7;
    clanEvent.boss5Lap = 7;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(true);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(true);
  });
  test("4段階をまたぐボスには攻撃不可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 22;
    clanEvent.boss2Lap = 23;
    clanEvent.boss3Lap = 23;
    clanEvent.boss4Lap = 23;
    clanEvent.boss5Lap = 23;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(false);
    expect(clanEvent.isAttackPossible(3)).toBe(false);
    expect(clanEvent.isAttackPossible(4)).toBe(false);
    expect(clanEvent.isAttackPossible(5)).toBe(false);
  });
  test("4段階をまたぐボスには攻撃不可能(複数)", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 22;
    clanEvent.boss2Lap = 23;
    clanEvent.boss3Lap = 23;
    clanEvent.boss4Lap = 22;
    clanEvent.boss5Lap = 23;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(false);
    expect(clanEvent.isAttackPossible(3)).toBe(false);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(false);
  });
  test("すべてのボスが4段階に到達したら攻撃可能", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 23;
    clanEvent.boss2Lap = 23;
    clanEvent.boss3Lap = 23;
    clanEvent.boss4Lap = 23;
    clanEvent.boss5Lap = 23;
    expect(clanEvent.isAttackPossible(1)).toBe(true);
    expect(clanEvent.isAttackPossible(2)).toBe(true);
    expect(clanEvent.isAttackPossible(3)).toBe(true);
    expect(clanEvent.isAttackPossible(4)).toBe(true);
    expect(clanEvent.isAttackPossible(5)).toBe(true);
  });
});
describe("getCurrentStage", () => {
  test("2段階目", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 1;
    clanEvent.boss2Lap = 1;
    clanEvent.boss3Lap = 1;
    clanEvent.boss4Lap = 1;
    clanEvent.boss5Lap = 1;
    expect(clanEvent.getCurrentStage(1)).toBe(2);
  });
  test("3段階目", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 7;
    clanEvent.boss2Lap = 7;
    clanEvent.boss3Lap = 7;
    clanEvent.boss4Lap = 7;
    clanEvent.boss5Lap = 7;
    expect(clanEvent.getCurrentStage(1)).toBe(3);
  });
  test("4段階目", () => {
    const clanEvent = new ClanEvent(1, 1);
    clanEvent.boss1Lap = 23;
    clanEvent.boss2Lap = 23;
    clanEvent.boss3Lap = 23;
    clanEvent.boss4Lap = 23;
    clanEvent.boss5Lap = 23;
    expect(clanEvent.getCurrentStage(1)).toBe(4);
  });
});
