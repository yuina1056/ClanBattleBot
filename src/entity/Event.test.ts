import MockDate from "mockdate";

import Event from "./Event";

describe("Event", () => {
  beforeEach(() => {
    MockDate.set(new Date("2000-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    MockDate.reset();
  });
  const event = new Event(
    "202308",
    new Date("2023-08-26T05:00:00.000Z"),
    new Date("2023-08-30T23:59:00.000Z")
  );
  it("クランバトル期間前", () => {
    MockDate.set(new Date("2023-08-26T04:59:00.000Z"));
    expect(() => {
      event.getClanBattleDay();
    }).toThrowError("クランバトル期間外です。");
  });
  it("クランバトル期間後", () => {
    MockDate.set(new Date("2023-08-31T00:00:00.000Z"));
    expect(() => {
      event.getClanBattleDay();
    }).toThrowError("クランバトル期間外です。");
  });
  it("クランバトル期間中(開始日境界値)", () => {
    MockDate.set(new Date("2023-08-26T05:00:00.000Z"));
    expect(event.getClanBattleDay()).toBe(1);
  });
  it("クランバトル期間中(終了日境界値)", () => {
    MockDate.set(new Date("2023-08-30T23:59:00.000Z"));
    expect(event.getClanBattleDay()).toBe(5);
  });
  it("クランバトル期間中(日付切り替わり境界値:変更前)", () => {
    MockDate.set(new Date("2023-08-27T04:59:00.000Z"));
    expect(event.getClanBattleDay()).toBe(1);
  });
  it("クランバトル期間中(日付切り替わり境界値:変更後)", () => {
    MockDate.set(new Date("2023-08-27T05:00:00.000Z"));
    expect(event.getClanBattleDay()).toBe(2);
  });
});
