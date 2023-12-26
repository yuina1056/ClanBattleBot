import { Repository } from "typeorm";
import dayjs from "dayjs";

import Event from "@/entity/Event";
import DataSource from "@/repository/datasource";

export class EventRepository {
  static readonly repository: Repository<Event> = DataSource.getRepository(Event);
  async findEventByToday(): Promise<Event | null> {
    const today = dayjs().format();
    return await EventRepository.repository
      .createQueryBuilder("event")
      .where("event.fromDate <= :today", { today })
      .andWhere("event.toDate >= :today", { today })
      .getOne();
  }
}
