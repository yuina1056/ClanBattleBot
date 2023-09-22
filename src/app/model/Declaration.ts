/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dayjs from 'dayjs';

import DataSource from '../../database/dataSource';
import User from '../../entityOld/User';
import Boss from '../../entityOld/Boss';
import Declaration from '../../entityOld/Declaration';
import Event from '../../entityOld/Event';
import Report from '../../entityOld/Report';

export async function regist(
  boss: Boss,
  discordUserId: string,
  attackCount: number
): Promise<User | Error> {
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
    return new Error('クランバトル開催情報が取得できませんでした');
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({ discordUserId: discordUserId });
  if (user == null) {
    return new Error('ユーザー情報が取得できませんでした');
  }

  // チェック
  const err = await validate(user, event, attackCount);
  if (err instanceof Error) {
    return err;
  }
  // DBに保存
  const declaration = new Declaration(
    user.clanId,
    user.id!,
    event!.id!,
    boss.id ?? 0,
    0,
    event.getClanBattleDay(),
    attackCount,
    false
  );
  await DataSource.getRepository(Declaration).save(declaration);

  return user;
}

async function validate(user: User, event: Event, attackCount: number): Promise<Error | null> {
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findBy({
    userId: user.id,
    eventId: event.id,
    day: event.getClanBattleDay(),
  });
  if (declaration.length === 0) {
    return null;
  }
  const declared = declaration.filter((declaration) => declaration.isFinished === false);
  if (declared.length > 0) {
    return new Error('既に' + declared[0].bossId + 'ボスに凸宣言済みです');
  }
  const attackCountDeclaration = declaration.filter(
    (declaration) => declaration.attackCount === attackCount
  );
  if (attackCountDeclaration.length >= 2) {
    return new Error('既に' + attackCount + '凸目は完了しています');
  }
  const reports = await DataSource.getRepository(Report).find({
    where: {
      attackCount: attackCount,
      day: event.getClanBattleDay(),
      isCarryOver: false,
    },
  });
  if (reports.length > 0) {
    return new Error('既に' + attackCount + '凸目は完了しています');
  }
  return null;
}

export default {
  regist,
};
