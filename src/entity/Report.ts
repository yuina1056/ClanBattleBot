import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
// 凸報告
export class Report {
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
  isShaved: boolean
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  constructor(clanId: number, userId: number, bossId: number, lap: number, damage: number, isShaved: boolean) {
    this.clanId = clanId
    this.userId = userId
    this.bossId = bossId
    this.lap = lap
    this.damage = damage
    this.isShaved = isShaved
  }
}
