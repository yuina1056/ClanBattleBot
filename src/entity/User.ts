import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany , ManyToOne } from "typeorm"
import Report from "./Report"
import Clan from "./Clan"
import Event from "./Event"
import Declaration from "./Declaration"

@Entity()
// ユーザー
export default class User {
    @PrimaryGeneratedColumn()
    id?: number
    @Column()
    clanId: number
    @ManyToOne(() => Clan, clan => clan.users)
    clan!: Clan;
    @Column()
    name: string
    @Column()
    discordUserId: string
    @CreateDateColumn()
    CreatedAt?: Date
    @UpdateDateColumn()
    UpdatedAt?: Date
    @OneToMany(() => Report, report => report.user)
    reports?: Report[];
    @OneToMany(() => Declaration, declaration => declaration.user)
    declarations?: Declaration[];

    constructor(clanId: number, name: string, discordUserId: string) {
        this.clanId = clanId
        this.name = name
        this.discordUserId = discordUserId
    }
    public getAttackStatus(event: Event): string {
        let res: string = this.name + ' [－/－/－]'
        if (this.reports == null || this.reports.length === 0) {
        } else {
            const thisMonthReports = this.reports.filter(report => report.month === event.month)
            if (thisMonthReports.length !== 0) {
                const todayReports = thisMonthReports.filter(report => report.event.getClanBattleDay() === event.getClanBattleDay())
                if (todayReports.length !== 0) {
                    // 当日凸あり
                    res = this.name + ' ['
                    for (let index = 1; index <= 3; index++) {
                        const todayAttackCountReports = todayReports.filter(report => report.attackCount === index)
                        if (todayAttackCountReports.length === 0) {
                            // 凸なし
                            res += '－'
                        } else {
                            // 凸あり
                            if (todayAttackCountReports.length === 0) {
                                // 凸なし
                                res += '－'
                            } else {
                                // 凸あり
                                let resDefeat: string = ''
                                let resShave: string = ''
                                todayAttackCountReports.forEach(report => {
                                    if (!report.isCarryOver) {
                                        resShave = report.bossId + '削り'
                                    } else {
                                        resDefeat += report.bossId + '撃破'
                                    }
                                })
                                if (resDefeat === '') {
                                    res += resShave
                                } else {
                                    res += resDefeat + resShave
                                }
                            }
                        }
                        res += '/'
                    }
                    res += ']'
                }
            }
        }
        return res
    }
}
