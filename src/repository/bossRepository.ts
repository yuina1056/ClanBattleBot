import { Repository } from "typeorm";
import Boss from "@/entity/Boss";
import dataSource from "@/repository/datasource";

export class BossRepository {
  static readonly repository: Repository<Boss> = dataSource.getRepository(Boss);
  async getBossByClanIdAndChannelId(clanId: number, channelId: string): Promise<Boss | null> {
    return await BossRepository.repository.findOneBy({
      clanId: clanId,
      discordChannelId: channelId,
    });
  }
}
