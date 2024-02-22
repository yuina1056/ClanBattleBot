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
    bossNo: number,
    bossLap: number,
    day: number,
    attackCount: number,
    isAttackCarryOver: boolean,
    damage: number,
    isDefeat: boolean,
    isCarryOver: boolean,
  ): Promise<Report> {
    const report = new Report(
      clanId,
      userId,
      eventId,
      bossNo,
      bossLap,
      day,
      attackCount,
      isAttackCarryOver,
      damage,
      isDefeat,
      isCarryOver,
    );
    return await ReportRepository.repository.save(report);
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
  async getByClanIdAndEventIdAndDay(
    clanId: number,
    eventId: number,
    day: number,
  ): Promise<Report[]> {
    return await ReportRepository.repository.find({
      where: {
        clanId: clanId,
        eventId: eventId,
        day: day,
      },
    });
  }
}
