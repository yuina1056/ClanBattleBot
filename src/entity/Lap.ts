import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Config from "@/config/config";

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

  /**
   * ボスに攻撃可能かを判定する
   *
   * @param bossId ボスID(1~5)
   * @return true:攻撃可能 false:攻撃不可
   */
  isAttackPossible(bossId: number): boolean {
    if (
      this.boss1Lap == null ||
      this.boss2Lap == null ||
      this.boss3Lap == null ||
      this.boss4Lap == null ||
      this.boss5Lap == null
    ) {
      throw new Error("lap.boss1Lap is null");
    }
    switch (bossId) {
      case 1:
        // 周回差チェック
        if (
          this.boss1Lap - this.boss2Lap >= 2 ||
          this.boss1Lap - this.boss3Lap >= 2 ||
          this.boss1Lap - this.boss4Lap >= 2 ||
          this.boss1Lap - this.boss5Lap >= 2
        ) {
          return false;
        }
        // 3段階をまたぐボスチェック
        if (
          this.boss1Lap == Config.LapConfig.bossLap[3] - 1 &&
          this.boss2Lap < Config.LapConfig.bossLap[3] &&
          this.boss3Lap < Config.LapConfig.bossLap[3] &&
          this.boss4Lap < Config.LapConfig.bossLap[3] &&
          this.boss5Lap < Config.LapConfig.bossLap[3]
        ) {
          return false;
        }
        // 4段階をまたぐボスチェック
        if (
          this.boss1Lap == Config.LapConfig.bossLap[4] - 1 &&
          this.boss2Lap < Config.LapConfig.bossLap[4] &&
          this.boss3Lap < Config.LapConfig.bossLap[4] &&
          this.boss4Lap < Config.LapConfig.bossLap[4] &&
          this.boss5Lap < Config.LapConfig.bossLap[4]
        ) {
          return false;
        }
        break;
      case 2:
        // 周回差チェック
        if (
          this.boss2Lap - this.boss1Lap >= 2 ||
          this.boss2Lap - this.boss3Lap >= 2 ||
          this.boss2Lap - this.boss4Lap >= 2 ||
          this.boss2Lap - this.boss5Lap >= 2
        ) {
          return false;
        }
        // 3段階をまたぐボスチェック
        if (
          this.boss2Lap == Config.LapConfig.bossLap[3] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[3] &&
          this.boss3Lap < Config.LapConfig.bossLap[3] &&
          this.boss4Lap < Config.LapConfig.bossLap[3] &&
          this.boss5Lap < Config.LapConfig.bossLap[3]
        ) {
          return false;
        }
        // 4段階をまたぐボスチェック
        if (
          this.boss2Lap == Config.LapConfig.bossLap[4] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[4] &&
          this.boss3Lap < Config.LapConfig.bossLap[4] &&
          this.boss4Lap < Config.LapConfig.bossLap[4] &&
          this.boss5Lap < Config.LapConfig.bossLap[4]
        ) {
          return false;
        }
        break;
      case 3:
        // 周回差チェック
        if (
          this.boss3Lap - this.boss1Lap >= 2 ||
          this.boss3Lap - this.boss2Lap >= 2 ||
          this.boss3Lap - this.boss4Lap >= 2 ||
          this.boss3Lap - this.boss5Lap >= 2
        ) {
          return false;
        }
        // 3段階をまたぐボスチェック
        if (
          this.boss3Lap == Config.LapConfig.bossLap[3] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[3] &&
          this.boss2Lap < Config.LapConfig.bossLap[3] &&
          this.boss4Lap < Config.LapConfig.bossLap[3] &&
          this.boss5Lap < Config.LapConfig.bossLap[3]
        ) {
          return false;
        }
        // 4段階をまたぐボスチェック
        if (
          this.boss3Lap == Config.LapConfig.bossLap[4] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[4] &&
          this.boss2Lap < Config.LapConfig.bossLap[4] &&
          this.boss4Lap < Config.LapConfig.bossLap[4] &&
          this.boss5Lap < Config.LapConfig.bossLap[4]
        ) {
          return false;
        }
        break;
      case 4:
        // 周回差チェック
        if (
          this.boss4Lap - this.boss1Lap >= 2 ||
          this.boss4Lap - this.boss2Lap >= 2 ||
          this.boss4Lap - this.boss3Lap >= 2 ||
          this.boss4Lap - this.boss5Lap >= 2
        ) {
          return false;
        }
        // 3段階をまたぐボスチェック
        if (
          this.boss4Lap == Config.LapConfig.bossLap[3] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[3] &&
          this.boss2Lap < Config.LapConfig.bossLap[3] &&
          this.boss3Lap < Config.LapConfig.bossLap[3] &&
          this.boss5Lap < Config.LapConfig.bossLap[3]
        ) {
          return false;
        }
        // 4段階をまたぐボスチェック
        if (
          this.boss4Lap == Config.LapConfig.bossLap[4] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[4] &&
          this.boss2Lap < Config.LapConfig.bossLap[4] &&
          this.boss3Lap < Config.LapConfig.bossLap[4] &&
          this.boss5Lap < Config.LapConfig.bossLap[4]
        ) {
          return false;
        }
        break;
      case 5:
        // 周回差チェック
        if (
          this.boss5Lap - this.boss1Lap >= 2 ||
          this.boss5Lap - this.boss2Lap >= 2 ||
          this.boss5Lap - this.boss3Lap >= 2 ||
          this.boss5Lap - this.boss4Lap >= 2
        ) {
          return false;
        }
        // 3段階をまたぐボスチェック
        if (
          this.boss5Lap == Config.LapConfig.bossLap[3] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[3] &&
          this.boss2Lap < Config.LapConfig.bossLap[3] &&
          this.boss3Lap < Config.LapConfig.bossLap[3] &&
          this.boss4Lap < Config.LapConfig.bossLap[3]
        ) {
          return false;
        }
        // 4段階をまたぐボスチェック
        if (
          this.boss5Lap == Config.LapConfig.bossLap[4] - 1 &&
          this.boss1Lap < Config.LapConfig.bossLap[4] &&
          this.boss2Lap < Config.LapConfig.bossLap[4] &&
          this.boss3Lap < Config.LapConfig.bossLap[4] &&
          this.boss4Lap < Config.LapConfig.bossLap[4]
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
