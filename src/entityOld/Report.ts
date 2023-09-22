import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import User from './User';
import Event from './Event';

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
  bossId: number;
  @Column()
  lap: number;
  @Column()
  day: number;
  @Column()
  attackCount: number;
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
    bossId: number,
    lap: number,
    day: number,
    attackCount: number,
    damage: number,
    isDefeat: boolean,
    isCarryOver: boolean
  ) {
    this.clanId = clanId;
    this.userId = userId;
    this.eventId = eventId;
    this.bossId = bossId;
    this.lap = lap;
    this.day = day;
    this.attackCount = attackCount;
    this.damage = damage;
    this.isDefeat = isDefeat;
    this.isCarryOver = isCarryOver;
  }
}
