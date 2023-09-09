import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm"
import User from "./User"

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
  bossId: number
  @Column()
  lap: number
  @Column()
  damage: number
  @Column()
  isCarryOver: boolean
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  constructor(clanId: number, userId: number, bossId: number, lap: number, damage: number, isDefeated: boolean, isCarryOver: boolean) {
    this.clanId = clanId
    this.userId = userId
    this.bossId = bossId
    this.lap = lap
    this.damage = damage
    this.isCarryOver = isCarryOver
  }
}
