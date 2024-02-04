import { Repository } from "typeorm";
import EventBoss from "@/entity/EventBoss";
import dataSource from "@/repository/repository";

export class EventBossRepository {
  static readonly repository: Repository<EventBoss> = dataSource.getRepository(EventBoss);
  async getEventBossByClanIdAndEventId(clanId: number, eventId: number): Promise<EventBoss | null> {
    return await EventBossRepository.repository.findOneBy({
      clanId: clanId,
      eventId: eventId,
    });
  }
  async save(eventBoss: EventBoss): Promise<EventBoss> {
    return await EventBossRepository.repository.save(eventBoss);
  }
}
