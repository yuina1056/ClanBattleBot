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
}
