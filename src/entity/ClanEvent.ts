import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Clan from "@/entity/Clan";

@Entity()
// クラン毎イベント情報
export default class ClanEvent {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  clanId: number;
  @ManyToOne(() => Clan, (clan) => clan.clanEvents)
  clan!: Clan;

  @Column()
  eventId: number;

  @Column({ default: 1 })
  boss1Lap?: number;
  @Column({ default: 800 })
  boss1HP?: number;

  @Column({ default: 1 })
  boss2Lap?: number;
  @Column({ default: 1000 })
  boss2HP?: number;

  @Column({ default: 1 })
  boss3Lap?: number;
  @Column({ default: 1300 })
  boss3HP?: number;

  @Column({ default: 1 })
  boss4Lap?: number;
  @Column({ default: 1500 })
  boss4HP?: number;

  @Column({ default: 1 })
  boss5Lap?: number;
  @Column({ default: 2000 })
  boss5HP?: number;

  constructor(clanId: number, eventId: number) {
    this.clanId = clanId;
    this.eventId = eventId;
  }
}
