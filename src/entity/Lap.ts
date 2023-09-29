import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
// クランバトル周回数
export default class Lap {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  clanId: number;
  @Column()
  eventId: number;
  @Column({ default: 1 })
  boss1Lap?: number;
  @Column({ default: 1 })
  boss2Lap?: number;
  @Column({ default: 1 })
  boss3Lap?: number;
  @Column({ default: 1 })
  boss4Lap?: number;
  @Column({ default: 1 })
  boss5Lap?: number;

  constructor(clanId: number, eventId: number) {
    this.clanId = clanId;
    this.eventId = eventId;
  }
}
