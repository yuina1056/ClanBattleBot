/* eslint-disable @typescript-eslint/no-non-null-assertion */
import User from "@/entity/User";
import Boss from "@/entity/Boss";
import Event from "@/entity/Event";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { UserRepository } from "@/repository/userRepository";

export async function regist(
  boss: Boss,
  discordUserId: string,
  lap: number,
  attackCount: number,
  isAttackCarryOver: boolean,
  event: Event,
): Promise<User | Error> {
  // ユーザー取得
  const user = await new UserRepository().getUserByDiscordUserIdAndClanId(
    discordUserId,
    boss.clanId!,
  );
  if (user == null) {
    return new Error("ユーザー情報が取得できませんでした");
  }

  // チェック
  const err = await validate(user, event);
  if (err instanceof Error) {
    return err;
  }
  // DBに保存
  await new DeclarationRepository().create(
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
  return user;
}

async function validate(user: User, event: Event): Promise<Error | null> {
  const declarations = await new DeclarationRepository().getDeclarationsByUserIdAndEventIdAndDay(
    user.id!,
    event.id!,
    event.getClanBattleDay(),
  );
  // 凸宣言がない場合
  if (declarations.length === 0) {
    return null;
  }
  // 宣言済みの凸がある場合
  const declared = declarations.filter((declaration) => declaration.isFinished === false);
  if (declared.length > 0) {
    return new Error("既に" + declared[0].bossId + "ボスに凸宣言済みです");
  }

  return null;
}

export default {
  regist,
};
