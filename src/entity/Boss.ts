import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
// ボス情報
export default class Boss {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  bossNo: number;
  @Column()
  clanId: number;
  @Column()
  discordChannelId: string;

  constructor(clanId: number, bossNo: number, discordChannelId: string) {
    this.clanId = clanId;
    this.bossNo = bossNo;
    this.discordChannelId = discordChannelId;
  }
}
