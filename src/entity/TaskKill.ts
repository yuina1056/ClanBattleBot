import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
// タスクキル情報
export default class TaskKill {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  eventId: number;
  @Column()
  clanId: number;
  @Column()
  userId: number;
  @Column()
  day: number;

  constructor(eventId: number, clanId: number, userId: number, day: number) {
    this.eventId = eventId;
    this.clanId = clanId;
    this.userId = userId;
    this.day = day;
  }
}
