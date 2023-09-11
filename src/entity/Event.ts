import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from "typeorm"
import dayjs from "dayjs"

import Report from "./Report"
import Declaration from "./Declaration"

@Entity()
@Unique(["month"])
// クランバトル開催情報
export default class Event {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  month: string // yyyymmで入力
  @Column()
  fromDate: Date
  @Column()
  toDate: Date

  @OneToMany(() => Report, report => report.event)
  reports?: Report[];
  @OneToMany(() => Declaration, declaration => declaration.event)
  declarations?: Declaration[];

  constructor(month: string, fromDate: Date, toDate: Date) {
    this.month = month
    this.fromDate = fromDate
    this.toDate = toDate
  }

  public getClanBattleDay(): number {
    return dayjs().diff(dayjs(this.fromDate), 'day') + 1;
  }
}
