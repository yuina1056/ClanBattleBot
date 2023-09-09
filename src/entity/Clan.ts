import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm"
import User from "./User";

@Entity()
// クラン
export default class Clan {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  name: string
  @Column()
  discordRoleId: string
  @Column()
  discordCategoryId: string
  @Column({ default: 0 })
  boss1Lap?: number
  @Column({ default: 0 })
  boss2Lap?: number
  @Column({ default: 0 })
  boss3Lap?: number
  @Column({ default: 0 })
  boss4Lap?: number
  @Column({default: 0})
  boss5Lap?: number
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  @OneToMany(() => User, user => user.clan)
  users?: User[];

  constructor(name: string, roleId: string, categoryId: string) {
    this.name = name
    this.discordRoleId = roleId
    this.discordCategoryId = categoryId
  }
}
