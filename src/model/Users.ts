import { User } from "discord.js";

export default class Users {
  users: User[]

  constructor(users: User[]) {
    this.users = users
  }
  
}
