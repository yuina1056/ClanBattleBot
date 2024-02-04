// import { Repository } from "typeorm";
// import dataSource from "@/repository/repository";
// import Lap from "@/entity/Lap";

// export class LapRepository {
//   static readonly repository: Repository<Lap> = dataSource.getRepository(Lap);
//   async getLapByEventIdAndClanId(eventId: number, clanId: number): Promise<Lap | null> {
//     return await LapRepository.repository.findOneBy({
//       eventId: eventId,
//       clanId: clanId,
//     });
//   }
//   async save(lap: Lap): Promise<void> {
//     await LapRepository.repository.save(lap);
//   }
// }
