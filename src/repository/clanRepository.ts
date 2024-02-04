import { Repository } from "typeorm";
import Clan from "@/entity/Clan";
import dataSource from "@/repository/repository";

export class ClanRepository {
  static readonly repository: Repository<Clan> = dataSource.getRepository(Clan);
  async getClanByDiscordCategoryId(discordCategoryId: string): Promise<Clan | null> {
    return await ClanRepository.repository.findOneBy({
      discordCategoryId: discordCategoryId,
    });
  }
  async getClanByDiscordRoleId(discordRoleId: string): Promise<Clan | null> {
    return await ClanRepository.repository.findOneBy({
      discordRoleId: discordRoleId,
    });
  }
  async create(roleName: string, discordRoleId: string, discordCategoryId: string): Promise<Clan> {
    return await ClanRepository.repository.save({
      name: roleName,
      discordRoleId: discordRoleId,
      discordCategoryId: discordCategoryId,
    });
  }
}
