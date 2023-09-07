import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm"

@Entity()
// ボス情報
export default class Boss {
  @PrimaryGeneratedColumn()
  bossid: number
  @Column()
  clanId: number
  @Column()
  discordChannelId: string

  constructor(clanId: number, bossId: number, discordChannelId: string) {
    this.clanId = clanId
    this.bossid = bossId
    this.discordChannelId = discordChannelId
  }
}
