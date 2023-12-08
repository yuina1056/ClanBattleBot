import Event from "@/entity/Event";
import dayjs from "dayjs";
import mockDate from "mockdate";

describe("getClanBattleDay", () => {
  const event = new Event(
    "202311",
    dayjs("2023/11/25 05:00:00").toDate(),
    dayjs("2023/11/29 23:59:59").toDate(),
  );
  afterEach(() => {
    mockDate.reset();
  });
  test("クランバトル期間外", () => {
    mockDate.set(dayjs("2020/1/1 00:00:00").toDate());
    expect(() => event.getClanBattleDay()).toThrow("クランバトル期間外です。");
  });
  test("クランバトル期間外(境界値：開始)", () => {
    mockDate.set(dayjs("2023/11/25 04:59:59").toDate());
    expect(() => event.getClanBattleDay()).toThrow("クランバトル期間外です。");
  });
  test("クランバトル期間外(境界値：終了)", () => {
    mockDate.set(dayjs("2023/11/30 00:00:00").toDate());
    expect(() => event.getClanBattleDay()).toThrow("クランバトル期間外です。");
  });
  test("クランバトル期間内", () => {
    mockDate.set(dayjs("2023/11/26 05:00:00").toDate());
    expect(event.getClanBattleDay()).toBe(2);
  });
  test("クランバトル期間内(境界値：開始)", () => {
    mockDate.set(dayjs("2023/11/25 05:00:00").toDate());
    expect(event.getClanBattleDay()).toBe(1);
  });
  test("クランバトル期間内(境界値：終了)", () => {
    mockDate.set(dayjs("2023/11/29 23:59:59").toDate());
    expect(event.getClanBattleDay()).toBe(5);
  });
});
