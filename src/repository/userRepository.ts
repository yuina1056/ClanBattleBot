import User from "@/entity/User";
import { Repository } from "typeorm";
import dataSource from "@/repository/repository";

export class UserRepository {
  static readonly repository: Repository<User> = dataSource.getRepository(User);
  async getUserByDiscordUserIdAndClanId(
    discordUserId: string,
    clanId: number,
  ): Promise<User | null> {
    return await UserRepository.repository.findOneBy({
      discordUserId: discordUserId,
      clanId: clanId,
    });
  }
  async getUserByDiscordUserIdAndClanIdToRelationReports(
    discordUserId: string,
    clanId: number,
  ): Promise<User | null> {
    return await UserRepository.repository.findOne({
      where: {
        discordUserId: discordUserId,
        clanId: clanId,
      },
      relations: {
        reports: true,
      },
    });
  }
  async getUsersByClanIdToRelationReportsAndTaskKills(clanId: number): Promise<User[]> {
    return await UserRepository.repository.find({
      where: {
        clanId: clanId,
      },
      relations: {
        reports: true,
        taskKills: true,
      },
    });
  }
  async getUsersByClanId(clanId: number): Promise<User[]> {
    return await UserRepository.repository.find({
      where: {
        clanId: clanId,
      },
    });
  }
  async create(discordUserId: string, userName: string, clanId: number): Promise<User> {
    return await UserRepository.repository.save({
      discordUserId: discordUserId,
      name: userName,
      clanId: clanId,
    });
  }
  async save(user: User): Promise<User> {
    return await UserRepository.repository.save(user);
  }
  async deleteByClanId(clanId: number): Promise<void> {
    await UserRepository.repository
      .createQueryBuilder("user")
      .softDelete()
      .where("clanId = :clanId", { clanId: clanId })
      .execute();
  }
  async restoreByUserId(userId: number): Promise<void> {
    await UserRepository.repository.restore(userId);
  }
}
