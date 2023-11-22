/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  Guild,
} from "discord.js";
import dayjs from "dayjs";

import DataSource from "@/datasource";
import User from "@/entity/User";
import Report from "@/entity/Report";
import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";
import Declaration from "@/entity/Declaration";
import BossChannelMessage from "@/messages/BossChannelMessage";
import Lap from "@/entity/Lap";
import EventBoss from "@/entity/EventBoss";

export const customId = "report_defeat";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("撃破");

export async function execute(interaction: ButtonInteraction) {
  let content = "";
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
  }
  if (interaction.channel == null) {
    throw new Error("interaction.channel is null");
  }
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder("event")
    .where("event.fromDate <= :today", { today })
    .andWhere("event.toDate >= :today", { today })
    .getOne();
  if (event == null) {
    throw new Error("クランバトル開催情報が取得できませんでした");
  }
  const channel = guild.channels.cache.find(
    (channel) => channel.id === interaction.channel?.id
  );
  if (channel == null) {
    throw new Error("channel is null");
  }
  if (channel.parentId == null) {
    throw new Error("channel.parentId is null");
  }
  // クラン取得
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    discordChannelId: interaction.channel?.id,
  });
  if (boss == null) {
    throw new Error("ボス情報が取得できませんでした");
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan.id,
  });
  if (user == null) {
    throw new Error("ユーザー情報が取得できませんでした");
  }
  // 凸宣言取得
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findOneBy({
    isFinished: false,
  });
  if (declaration == null) {
    content = "凸宣言がされていません";
    await interaction.reply({ content: content, ephemeral: true });
    return;
  }
  if (declaration.id == null) {
    throw new Error("declaration.id is null");
  }
  // 対象凸を完了状態にする
  await declarationRepository.update(declaration.id, { isFinished: true });

  // 周回数・HP更新
  const lapRepository = DataSource.getRepository(Lap);
  const lap = await lapRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (lap == null) {
    throw new Error("周回数情報が取得できませんでした");
  }
  let bossLap = 0;

  const eventBossRepository = DataSource.getRepository(EventBoss);
  const eventBoss = await eventBossRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (eventBoss == null) {
    throw new Error("クランバトルボスのHP情報が取得できませんでした");
  }

  switch (boss.bossid) {
    case 1:
      if (lap.boss1Lap == null) {
        throw new Error("lap.boss1Lap is null");
      }
      lap.boss1Lap += 1;
      bossLap = lap.boss1Lap;
      eventBoss.boss1HP = 27000;
      break;
    case 2:
      if (lap.boss2Lap == null) {
        throw new Error("lap.boss2Lap is null");
      }
      lap.boss2Lap += 1;
      bossLap = lap.boss2Lap;
      eventBoss.boss2HP = 28000;
      break;
    case 3:
      if (lap.boss3Lap == null) {
        throw new Error("lap.boss3Lap is null");
      }
      lap.boss3Lap += 1;
      bossLap = lap.boss3Lap;
      eventBoss.boss3HP = 30000;
      break;
    case 4:
      if (lap.boss4Lap == null) {
        throw new Error("lap.boss4Lap is null");
      }
      lap.boss4Lap += 1;
      bossLap = lap.boss4Lap;
      eventBoss.boss4HP = 31000;
      break;
    case 5:
      if (lap.boss5Lap == null) {
        throw new Error("lap.boss5Lap is null");
      }
      lap.boss5Lap += 1;
      bossLap = lap.boss5Lap;
      eventBoss.boss5HP = 32000;
      break;
    default:
      break;
  }
  await lapRepository.save(lap);
  await eventBossRepository.save(eventBoss);

  // 持ち越しが発生しているかチェック
  let isCarryOver = false;
  const reports = await DataSource.getRepository(Report).find({
    where: {
      eventId: event.id,
      day: declaration.day,
      attackCount: declaration.attackCount,
    },
  });
  if (reports.length === 0) {
    isCarryOver = true;
  }

  // DBに保存
  const report = new Report(
    user.clanId,
    user.id!,
    event.id!,
    boss.bossid,
    bossLap,
    event.getClanBattleDay(),
    declaration.attackCount,
    0,
    true,
    isCarryOver
  );
  await DataSource.getRepository(Report).save(report);

  content = user.name + "が" + boss.bossid + "ボスを撃破しました";

  const declarations = await DataSource.getRepository(Declaration).find({
    where: {
      bossId: boss.id,
      isFinished: false,
    },
    relations: {
      user: true,
    },
  });
  await BossChannelMessage.sendMessage(
    interaction.channel,
    clan,
    boss,
    eventBoss,
    lap,
    declarations
  );
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute,
};
