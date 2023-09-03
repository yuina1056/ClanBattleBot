import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany , ManyToOne} from "typeorm"
import Report from "./Report"
import Clan from "./Clan"

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

    constructor(clanId: number, name: string, discordUserId: string) {
        this.clanId = clanId
        this.name = name
        this.discordUserId = discordUserId
    }
}
