import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
// イベント毎ボス情報
export default class EventBoss {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  clanId: number;
  @Column()
  eventId: number;
  @Column({ default: 800 })
  boss1HP?: number;
  @Column({ default: 1000 })
  boss2HP?: number;
  @Column({ default: 1300 })
  boss3HP?: number;
  @Column({ default: 1500 })
  boss4HP?: number;
  @Column({ default: 2000 })
  boss5HP?: number;

  constructor(clanId: number, eventId: number) {
    this.clanId = clanId;
    this.eventId = eventId;
  }
}
