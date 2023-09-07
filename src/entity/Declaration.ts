import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm"
import User from "./User"

@Entity()
// 凸宣言
export default class Declaration {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  clanId: number
  @Column()
  userId: number
  @ManyToOne(() => User, user => user.declarations)
  user!: User;
  @Column()
  bossId: number
  @Column()
  lap: number
  @Column()
  isFinished: boolean
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  constructor(clanId: number, userId: number, bossId: number, lap: number, isFinished: boolean) {
    this.clanId = clanId
    this.userId = userId
    this.bossId = bossId
    this.lap = lap
    this.isFinished = isFinished
  }
}
