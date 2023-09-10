import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm"
import User from "./User"
import Event from "./Event"

@Entity()
// 凸報告
export default class Report {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  clanId: number
  @Column()
  userId: number
  @ManyToOne(() => User, user => user.reports)
  user!: User;
  @Column()
  month: string
  @ManyToOne(() => Event, event => event.reports)
  event!: Event;
  @Column()
  bossId: number
  @Column()
  lap: number
  @Column()
  day: number
  @Column()
  attackCount: number
  @Column()
  damage: number
  @Column()
  isCarryOver: boolean
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  constructor(clanId: number, userId: number, month: string, bossId: number, lap: number, day: number, attackCount: number, damage: number, isCarryOver: boolean) {
    this.clanId = clanId
    this.userId = userId
    this.month = month
    this.bossId = bossId
    this.lap = lap
    this.day = day
    this.attackCount = attackCount
    this.damage = damage
    this.isCarryOver = isCarryOver
  }
}
