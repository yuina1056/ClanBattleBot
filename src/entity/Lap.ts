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

  isAttackPossible(bossId: number): boolean {
    switch (bossId) {
      case 1:
        if (
          this.boss1Lap! - this.boss2Lap! >= 2 ||
          this.boss1Lap! - this.boss3Lap! >= 2 ||
          this.boss1Lap! - this.boss4Lap! >= 2 ||
          this.boss1Lap! - this.boss5Lap! >= 2
        ) {
          return false;
        }
        break;
      case 2:
        if (
          this.boss2Lap! - this.boss1Lap! >= 2 ||
          this.boss2Lap! - this.boss3Lap! >= 2 ||
          this.boss2Lap! - this.boss4Lap! >= 2 ||
          this.boss2Lap! - this.boss5Lap! >= 2
        ) {
          return false;
        }
        break;
      case 3:
        if (
          this.boss3Lap! - this.boss1Lap! >= 2 ||
          this.boss3Lap! - this.boss2Lap! >= 2 ||
          this.boss3Lap! - this.boss4Lap! >= 2 ||
          this.boss3Lap! - this.boss5Lap! >= 2
        ) {
          return false;
        }
        break;
      case 4:
        if (
          this.boss4Lap! - this.boss1Lap! >= 2 ||
          this.boss4Lap! - this.boss2Lap! >= 2 ||
          this.boss4Lap! - this.boss3Lap! >= 2 ||
          this.boss4Lap! - this.boss5Lap! >= 2
        ) {
          return false;
        }
        break;
      case 5:
        if (
          this.boss5Lap! - this.boss1Lap! >= 2 ||
          this.boss5Lap! - this.boss2Lap! >= 2 ||
          this.boss5Lap! - this.boss3Lap! >= 2 ||
          this.boss5Lap! - this.boss4Lap! >= 2
        ) {
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  }
}
