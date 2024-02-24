import { Repository } from "typeorm";
import Boss from "@/entity/Boss";
import dataSource from "@/repository/repository";

export class BossRepository {
  static readonly repository: Repository<Boss> = dataSource.getRepository(Boss);
  async getBossByClanIdAndChannelId(clanId: number, channelId: string): Promise<Boss | null> {
    return await BossRepository.repository.findOneBy({
      clanId: clanId,
      discordChannelId: channelId,
    });
  }
  async create(clanId: number, discordChannelId: string, bossNo: number): Promise<Boss> {
    return await BossRepository.repository.save({
      clanId: clanId,
      discordChannelId: discordChannelId,
      bossNo: bossNo,
    });
  }
  async getAll(): Promise<Boss[]> {
    return await BossRepository.repository.find();
  }
  async getByClanIdAndBossNo(clanId: number, bossNo: number): Promise<Boss | null> {
    return await BossRepository.repository.findOneBy({
      clanId: clanId,
      bossNo: bossNo,
    });
  }
}
