import { Entity, Column, PrimaryColumn } from "typeorm"
import dayjs from "dayjs"


@Entity()
// クランバトル開催情報
export default class Event {
  @PrimaryColumn()
  month: string // yyyymmで入力
  @Column()
  fromDate: Date
  @Column()
  toDate: Date

  constructor(month: string, fromDate: Date, toDate: Date) {
    this.month = month
    this.fromDate = fromDate
    this.toDate = toDate
  }

  public getClanBattleDay(): number {
    return dayjs().diff(dayjs(this.fromDate), 'day') + 1;
  }
}
