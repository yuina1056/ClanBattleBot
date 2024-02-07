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
// 凸報告
export default class Report {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  clanId: number;
  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.reports)
  user!: User;
  @Column()
  eventId: number;
  @ManyToOne(() => Event, (event) => event.reports)
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
  damage: number;
  @Column()
  isDefeat: boolean;
  @Column()
  isCarryOver: boolean;
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
    isAttackCarryOver: boolean,
    damage: number,
    isDefeat: boolean,
    isCarryOver: boolean,
  ) {
    this.clanId = clanId;
    this.userId = userId;
    this.eventId = eventId;
    this.bossNo = bossNo;
    this.lap = lap;
    this.day = day;
    this.attackCount = attackCount;
    this.isAttackCarryOver = isAttackCarryOver;
    this.damage = damage;
    this.isDefeat = isDefeat;
    this.isCarryOver = isCarryOver;
  }
}
