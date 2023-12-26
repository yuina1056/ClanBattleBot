import { Repository } from "typeorm";
import Declaration from "@/entity/Declaration";
import dataSource from "@/repository/repository";

export class DeclarationRepository {
  static readonly repository: Repository<Declaration> = dataSource.getRepository(Declaration);
  async getDeclarationsByBossIdAndIsFinishedToRelationUser(
    bossId: number,
    isFinished: boolean,
  ): Promise<Declaration[]> {
    return await DeclarationRepository.repository.find({
      where: {
        bossId: bossId,
        isFinished: isFinished,
      },
      relations: {
        user: true,
      },
    });
  }
  async getDeclarationsByUserIdAndEventIdAndDay(
    userId: number,
    eventId: number,
    day: number,
  ): Promise<Declaration[]> {
    return await DeclarationRepository.repository.find({
      where: {
        userId: userId,
        eventId: eventId,
        day: day,
      },
    });
  }
  async getDeclarationByClanIdAndUserIdAndIsFinished(
    clanId: number,
    userId: number,
    isFinished: boolean,
  ): Promise<Declaration | null> {
    return await DeclarationRepository.repository.findOneBy({
      clanId: clanId,
      userId: userId,
      isFinished: isFinished,
    });
  }
  async getDeclarationByUserIdAndClanIdAndEventIdAndDayAndIsFinished(
    userId: number,
    clanId: number,
    eventId: number,
    day: number,
    isFinished: boolean,
  ): Promise<Declaration | null> {
    return await DeclarationRepository.repository.findOneBy({
      userId: userId,
      clanId: clanId,
      eventId: eventId,
      day: day,
      isFinished: isFinished,
    });
  }
  async save(declaration: Declaration): Promise<void> {
    await DeclarationRepository.repository.save(declaration);
  }
  async create(
    clanId: number,
    userId: number,
    eventId: number,
    bossId: number,
    lap: number,
    day: number,
    attackCount: number,
    isFinished: boolean,
    isAttackCarryOver: boolean,
  ): Promise<void> {
    await DeclarationRepository.repository.save({
      clanId: clanId,
      userId: userId,
      eventId: eventId,
      bossId: bossId,
      lap: lap,
      day: day,
      attackCount: attackCount,
      isFinished: isFinished,
      isAttackCarryOver: isAttackCarryOver,
    });
  }
  async deleteById(id: number): Promise<void> {
    await DeclarationRepository.repository.delete(id);
  }
  async deleteByUserIdAndEventIdAndDayAndAttackCount(
    userId: number,
    eventId: number,
    day: number,
    attackCount: number,
  ): Promise<void> {
    await DeclarationRepository.repository
      .createQueryBuilder("declaration")
      .delete()
      .where("declaration.userId = :userId", { userId: userId })
      .andWhere("declaration.eventId = :eventId", { eventId: eventId })
      .andWhere("declaration.day = :day", { day: day })
      .andWhere("declaration.attackCount = :attackCount", { attackCount: attackCount })
      .execute();
  }
  async updateIsFinishedById(id: number, isFinished: boolean): Promise<void> {
    await DeclarationRepository.repository.update(id, {
      isFinished: isFinished,
    });
  }
}
