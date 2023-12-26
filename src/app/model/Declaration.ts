/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dayjs from "dayjs";

import DataSource from "@/repository/datasource";
import User from "@/entity/User";
import Boss from "@/entity/Boss";
import Declaration from "@/entity/Declaration";
import Event from "@/entity/Event";

export async function regist(
  boss: Boss,
  discordUserId: string,
  lap: number,
  attackCount: number,
  isAttackCarryOver: boolean,
): Promise<User | Error> {
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder("event")
    .where("event.fromDate <= :today", { today })
    .andWhere("event.toDate >= :today", { today })
    .getOne();
  if (event == null) {
    return new Error("クランバトル開催情報が取得できませんでした");
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: discordUserId,
    clanId: boss.clanId,
  });
  if (user == null) {
    return new Error("ユーザー情報が取得できませんでした");
  }

  // チェック
  const err = await validate(user, event);
  if (err instanceof Error) {
    return err;
  }
  // DBに保存
  const declaration = new Declaration(
    user.clanId,
    user.id!,
    event!.id!,
    boss.bossid,
    lap,
    event.getClanBattleDay(),
    attackCount,
    false,
    isAttackCarryOver,
  );
  await DataSource.getRepository(Declaration).save(declaration);

  return user;
}

async function validate(user: User, event: Event): Promise<Error | null> {
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findBy({
    userId: user.id,
    eventId: event.id,
    day: event.getClanBattleDay(),
  });
  // 凸宣言がない場合
  if (declaration.length === 0) {
    return null;
  }
  // 宣言済みの凸がある場合
  const declared = declaration.filter((declaration) => declaration.isFinished === false);
  if (declared.length > 0) {
    return new Error("既に" + declared[0].bossId + "ボスに凸宣言済みです");
  }

  return null;
}

export default {
  regist,
};
