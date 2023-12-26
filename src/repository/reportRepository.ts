import { Repository } from "typeorm";
import Report from "@/entity/Report";
import dataSource from "@/repository/repository";

export class ReportRepository {
  static readonly repository: Repository<Report> = dataSource.getRepository(Report);
  async getReportsByUserIdAndEventIdAndDayAndAttackCount(
    userId: number,
    eventId: number,
    day: number,
    attackCount: number,
  ): Promise<Report[]> {
    return await ReportRepository.repository.find({
      where: {
        userId: userId,
        eventId: eventId,
        day: day,
        attackCount: attackCount,
      },
    });
  }
  async create(
    clanId: number,
    userId: number,
    eventId: number,
    bossId: number,
    bossLap: number,
    day: number,
    attackCount: number,
    isAttackCarryOver: boolean,
    damage: number,
    isDefeat: boolean,
    isCarryOver: boolean,
  ): Promise<Report> {
    return await ReportRepository.repository.save({
      clanId,
      userId,
      eventId,
      bossId,
      bossLap,
      day,
      attackCount,
      isAttackCarryOver,
      damage,
      isDefeat,
      isCarryOver,
    });
  }
  async deleteByUserIdAndEventIdAndDayAndAttackCount(
    userId: number,
    eventId: number,
    day: number,
    attackCount: number,
  ): Promise<void> {
    await ReportRepository.repository
      .createQueryBuilder("report")
      .delete()
      .where("report.userId = :userId", { userId: userId })
      .andWhere("report.eventId = :eventId", { eventId: eventId })
      .andWhere("report.day = :day", { day: day })
      .andWhere("report.attackCount = :attackCount", { attackCount: attackCount })
      .execute();
  }
}
