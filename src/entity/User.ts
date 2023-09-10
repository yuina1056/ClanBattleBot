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
        let res: string = ''
        if (this.reports == null || this.reports.length === 0) {
            // bot登録から一度も凸したことがない場合
            res = this.name+' [－/－/－]'
        } else {
            // bot登録してから一度凸したことがある
            const thisMonthReports = this.reports.filter(report => report.month === event.month)
            if (thisMonthReports.length === 0) {
                // クラバト期間内無凸
                res = this.name + ' [－/－/－]'
            } else {
                // クラバト期間内凸あり
                const todayReports = thisMonthReports.filter(report => report.event.getClanBattleDay() === event.getClanBattleDay())
                if (todayReports.length === 0) {
                    // 当日無凸
                    res = this.name + ' [－/－/－]'
                } else {
                    // 当日凸あり
                    const boss1Reports = todayReports.filter(report => report.bossId === 1)
                    const boss2Reports = todayReports.filter(report => report.bossId === 2)
                    const boss3Reports = todayReports.filter(report => report.bossId === 3)
                    const boss4Reports = todayReports.filter(report => report.bossId === 4)
                    const boss5Reports = todayReports.filter(report => report.bossId === 5)
                    const boss1Damage = boss1Reports.reduce((sum, report) => sum + report.damage, 0)
                    const boss2Damage = boss2Reports.reduce((sum, report) => sum + report.damage, 0)
                    const boss3Damage = boss3Reports.reduce((sum, report) => sum + report.damage, 0)
                    const boss4Damage = boss4Reports.reduce((sum, report) => sum + report.damage, 0)
                    const boss5Damage = boss5Reports.reduce((sum, report) => sum + report.damage, 0)
                    res = this.name + ' [' + boss1Damage + '/' + boss2Damage + '/' + boss3Damage + '/' + boss4Damage + '/' + boss5Damage + ']'
                }
            }
        }


        return res
    }
}
