import { Repository } from "typeorm";
import dataSource from "@/repository/repository";
import ClanEvent from "@/entity/ClanEvent";

export class ClanEventRepository {
  static readonly repository: Repository<ClanEvent> = dataSource.getRepository(ClanEvent);
  async getClanEventByClanIdAndEventId(clanId: number, eventId: number): Promise<ClanEvent | null> {
    return await ClanEventRepository.repository.findOneBy({
      clanId: clanId,
      eventId: eventId,
    });
  }
  async save(clanEvent: ClanEvent): Promise<ClanEvent> {
    return await ClanEventRepository.repository.save(clanEvent);
  }
}
