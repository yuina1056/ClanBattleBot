import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

type bossNo = number;
type BossNo = number;
@Entity()
// ボス情報
export default class Boss {
  @PrimaryGeneratedColumn()
  id?: bossNo;
  @Column()
  bossNo: BossNo;
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
