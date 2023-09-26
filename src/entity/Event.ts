import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import dayjs from "dayjs";

import Report from "@/entity/Report";
import Declaration from "@/entity/Declaration";

@Entity()
@Unique(["month"])
// クランバトル開催情報
export default class Event {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  month: string; // yyyymmで入力
  @Column()
  fromDate: Date;
  @Column()
  toDate: Date;

  @OneToMany(() => Report, (report) => report.event)
  reports?: Report[];
  @OneToMany(() => Declaration, (declaration) => declaration.event)
  declarations?: Declaration[];

  constructor(month: string, fromDate: Date, toDate: Date) {
    this.month = month;
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  public getClanBattleDay(): number {
    const now = dayjs();
    if (now.isBefore(dayjs(this.fromDate))) {
      throw new Error("クランバトル期間外です。");
    }
    if (now.isAfter(dayjs(this.toDate))) {
      throw new Error("クランバトル期間外です。");
    }
    const dayDifference = now.diff(dayjs(this.fromDate), "day");

    return dayDifference + 1;
  }
}
