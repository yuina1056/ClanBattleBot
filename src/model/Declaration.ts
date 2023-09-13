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
    throw new Error('クランバトル開催情報が取得できませんでした')
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: discordChannelId })
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした')
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({ discordUserId: discordUserId })
  if (user == null) {
    throw new Error('ユーザー情報が取得できませんでした')
  }

  // チェック
  await validate(user, event, attackCount).catch((error) => {
    throw error
  })
  // DBに保存
  const declaration = new Declaration(user.clanId, user.id!, event!.id!, boss.bossid, 0, event.getClanBattleDay(), attackCount, false)
  const declarationRepository = DataSource.getRepository(Declaration)
  await declarationRepository.save(declaration)

  return user
}

async function validate(user: User, event: Event, attackCount: number): Promise<User | null> {
  const declarationRepository = DataSource.getRepository(Declaration)
  const declaration = await declarationRepository.findBy({ userId: user.id, eventId: event.id, day: event.getClanBattleDay() })
  if (declaration.length === 0) {
    return user
  }
  const declared = declaration.filter((declaration) => declaration.isFinished === false)
  if (declared.length > 0) {
    throw new Error('すでに凸宣言済みです')
  }
  const attackCountDeclaration = declaration.filter((declaration) => declaration.attackCount === attackCount)
  console.log(attackCountDeclaration.length)
  if (attackCountDeclaration.length >= 2) {
    throw new Error(attackCount+'凸目は完了しています')
  }
  return user
}

export default {
  regist
};
