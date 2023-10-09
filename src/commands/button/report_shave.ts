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
import Lap from "@/entity/Lap";
import Declaration from "@/entity/Declaration";
import BossChannelMessage from "@/messages/BossChannelMessage";

export const customId = "report_shave";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("削り");

export async function execute(interaction: ButtonInteraction) {
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
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
    (channel) => channel.id === interaction.channel!.id
  );
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel!.parentId!,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    discordChannelId: interaction.channel!.id,
  });
  if (boss == null) {
    throw new Error("ボス情報が取得できませんでした");
  }

  // 周回数取得
  const lapRepository = DataSource.getRepository(Lap);
  const lap = await lapRepository.findOneBy({
    eventId: event.id,
    clanId: clan.id,
  });
  if (lap == null) {
    throw new Error("周回数が取得できませんでした");
  }
  let bossLap = 0;
  switch (boss.bossid) {
    case 1:
      bossLap = lap.boss1Lap ?? 0;
      break;
    case 2:
      bossLap = lap.boss2Lap ?? 0;
      break;
    case 3:
      bossLap = lap.boss3Lap ?? 0;
      break;
    case 4:
      bossLap = lap.boss4Lap ?? 0;
      break;
    case 5:
      bossLap = lap.boss5Lap ?? 0;
      break;
    default:
      break;
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan?.id,
  });
  if (user == null) {
    throw new Error("ユーザー情報が取得できませんでした");
  }
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findOneBy({
    isFinished: false,
  });
  if (declaration == null) {
    await interaction.reply({ content: "凸宣言がされていません" });
    return;
  }
  await declarationRepository.update(declaration!.id!, { isFinished: true });

  // DBに保存
  const report = new Report(
    user.clanId,
    user.id!,
    event!.id!,
    boss.bossid,
    bossLap,
    event.getClanBattleDay(),
    declaration.attackCount,
    0,
    false,
    false
  );
  const reportRepository = DataSource.getRepository(Report);
  await reportRepository.save(report);

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
    interaction.channel!,
    clan,
    boss,
    lap,
    declarations
  );
  await interaction.reply({
    content: user.name + "が" + boss.bossid + "ボスを削りました",
  });
}

export default {
  customId,
  data,
  execute,
};
