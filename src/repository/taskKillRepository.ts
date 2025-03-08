import TaskKill from "@/entity/TaskKill";
import { Repository } from "typeorm";

import DataSource from "@/repository/repository";

export class TaskKillRepository {
  static readonly repository: Repository<TaskKill> = DataSource.getRepository(TaskKill);
  async findTaskKillByEventIdAndClanIdAndUserIdAndDay(
    eventId: number,
    clanId: number,
    userId: number,
    day: number,
  ): Promise<TaskKill | null> {
    return await TaskKillRepository.repository
      .createQueryBuilder("taskKill")
      .where("taskKill.eventId = :eventId", { eventId })
      .andWhere("taskKill.clanId = :clanId", { clanId })
      .andWhere("taskKill.userId = :userId", { userId })
      .andWhere("taskKill.day = :day", { day })
      .getOne();
  }
  async create(eventId: number, clanId: number, userId: number, day: number): Promise<TaskKill> {
    const taskKill = new TaskKill(eventId, clanId, userId, day);
    return await TaskKillRepository.repository.save(taskKill);
  }
}
