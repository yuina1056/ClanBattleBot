import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";
import User from "@/entity/User";
import Event from "@/entity/Event";

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
  bossNo: number;
  @Column()
  lap: number;
  @Column()
  day: number;
  @Column()
  attackCount: number;
  @Column()
  isAttackCarryOver: boolean;
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
    bossNo: number,
    lap: number,
    day: number,
    attackCount: number,
    isFinished: boolean,
    isAttackCarryOver: boolean,
  ) {
    this.clanId = clanId;
    this.userId = userId;
    this.eventId = eventId;
    this.bossNo = bossNo;
    this.lap = lap;
    this.day = day;
    this.attackCount = attackCount;
    this.isFinished = isFinished;
    this.isAttackCarryOver = isAttackCarryOver;
  }
}
