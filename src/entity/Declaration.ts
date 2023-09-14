import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";
import User from "./User";
import Event from "./Event";

@Entity()
// 凸宣言
export default class Declaration {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  clanId: number;
  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.declarations)
  user!: User;
  @Column()
  eventId: number;
  @ManyToOne(() => Event, (event) => event.declarations)
  event!: Event;
  @Column()
  bossId: number;
  @Column()
  lap: number;
  @Column()
  day: number;
  @Column()
  attackCount: number;
  @Column()
  isFinished: boolean;
  @CreateDateColumn()
  CreatedAt?: Date;
  @UpdateDateColumn()
  UpdatedAt?: Date;

  constructor(
    clanId: number,
    userId: number,
    eventId: number,
    bossId: number,
    lap: number,
    day: number,
    attackCount: number,
    isFinished: boolean,
  ) {
    this.clanId = clanId;
    this.userId = userId;
    this.eventId = eventId;
    this.bossId = bossId;
    this.lap = lap;
    this.day = day;
    this.attackCount = attackCount;
    this.isFinished = isFinished;
  }
}
