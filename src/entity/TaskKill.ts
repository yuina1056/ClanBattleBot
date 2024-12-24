import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "@/entity/User";

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
  @ManyToOne(() => User, (user) => user.taskKills)
  user!: User;
  @Column()
  day: number;

  constructor(eventId: number, clanId: number, userId: number, day: number) {
    this.eventId = eventId;
    this.clanId = clanId;
    this.userId = userId;
    this.day = day;
  }
}
