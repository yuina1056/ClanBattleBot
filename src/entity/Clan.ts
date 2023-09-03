import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm"
import { User } from "./User";

@Entity()
// クラン
export class Clan {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  name: string
  @Column()
  discordRoleId: string
  @CreateDateColumn()
  CreatedAt?: Date
  @UpdateDateColumn()
  UpdatedAt?: Date

  @OneToMany(() => User, user => user.clan)
  users?: User[];

  constructor(name: string, roleID: string) {
    this.name = name
    this.discordRoleId = roleID
  }
}
