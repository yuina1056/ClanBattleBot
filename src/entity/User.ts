import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import dayjs from "dayjs";

import Report from "@/entity/Report";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";
import Declaration from "@/entity/Declaration";
import TaskKill from "./TaskKill";

@Entity()
// ユーザー
export default class User {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  clanId: number;
  @ManyToOne(() => Clan, (clan) => clan.users)
  clan!: Clan;
  @Column()
  name: string;
  @Column()
  discordUserId: string;
  @CreateDateColumn()
  CreatedAt?: Date;
  @UpdateDateColumn()
  UpdatedAt?: Date;
  @DeleteDateColumn()
  DeletedAt?: Date;
  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];
  @OneToMany(() => Declaration, (declaration) => declaration.user)
  declarations?: Declaration[];
  @OneToMany(() => TaskKill, (taskKill) => taskKill.user)
  taskKills?: TaskKill[];

  constructor(clanId: number, name: string, discordUserId: string) {
    this.clanId = clanId;
    this.name = name;
    this.discordUserId = discordUserId;
  }
  public getAttackStatus(event: Event | null): string {
    const shortenName = this.name.substring(0, 10).padEnd(10);
    let res: string = shortenName + " [－/－/－]";

    if (event == null || this.reports == null || this.reports.length === 0) {
      return res + " (記録なし)";
    }

    if (this.taskKills == null || this.taskKills.length === 0) {
      return res;
    }
    // タスクキルチェック
    const todayTaskKill = this.taskKills.find((taskKill) => {
      return taskKill.day == event.getClanBattleDay() && taskKill.eventId == event.id;
    });

    if (todayTaskKill != null) {
      res = "🚫" + res;
    }

    if (this.reports.length === 0) {
      return res + " (記録なし)";
    }
    const maxId = Math.max(...(this.reports.map((report) => report.id) as number[]));
    const latestReport = this.reports.find((report) => report.id === maxId);
    if (latestReport == null) {
      return res + " (記録なし)";
    }
    const thisMonthReports = this.reports.filter((report) => {
      return report.eventId == event.id;
    });

    if (thisMonthReports.length === 0) {
      return res + "(" + dayjs(latestReport.CreatedAt).format("MM/DD HH:mm") + ") 【当月凸なし】";
    } else {
      const todayReports = thisMonthReports.filter((report) => {
        return report.day == event.getClanBattleDay();
      });
      if (todayReports.length === 0) {
        return res + "(" + dayjs(latestReport.CreatedAt).format("MM/DD HH:mm") + ") 【当日凸なし】";
      }
      // 当日凸あり
      res = shortenName + " [";
      for (let index = 1; index <= 3; index++) {
        const todayAttackCountReports = todayReports.filter(
          (report) => report.attackCount === index,
        );
        if (todayAttackCountReports.length === 0) {
          // 凸なし
          res += "－";
        } else {
          // 凸あり
          let resDefeat = "";
          let resShave = "";
          todayAttackCountReports.forEach((report) => {
            if (!report.isDefeat) {
              resShave = report.bossNo + "削り";
            } else {
              resDefeat += report.bossNo + "撃破";
            }
          });
          if (resDefeat === "") {
            res += resShave;
          } else {
            res += resDefeat + resShave;
          }
        }
        if (index !== 3) {
          res += "/";
        }
      }
      res += "] (" + dayjs(latestReport.CreatedAt).format("MM/DD HH:mm") + ")";
    }
    return res;
  }

  public getTodayReports(event: Event, dayCount: number): Report[] | null {
    if (this.reports == null) {
      return null;
    }
    return this.reports.filter((report) => {
      return report.eventId == event.id && report.day == dayCount;
    });
  }
}
