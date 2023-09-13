import dayjs from 'dayjs';

import DataSource from '../datasource';
import User from '../entity/User';
import Boss from '../entity/Boss';
import Declaration from '../entity/Declaration';
import Event from '../entity/Event';

export async function regist(discordChannelId: string, discordUserId: string,attackCount: number) {
  const today = dayjs().format()
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
    return
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: discordChannelId })
  if (boss == null) {
    return
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({ discordUserId: discordUserId })
  if (user == null) {
    return
  }

  // DBに保存
  const declaration = new Declaration(user.clanId, user.id!, event!.id!, boss.bossid, 0, event.getClanBattleDay(), attackCount, false)
  const declarationRepository = DataSource.getRepository(Declaration)
  await declarationRepository.save(declaration)

  return user
}

export default {
  regist
};
