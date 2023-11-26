/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";
import dayjs from "dayjs";

import DataSource from "@/datasource";

import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";

import reportShave from "@/commands/modal/reportShave";
import EventBoss from "@/entity/EventBoss";
import Declaration from "@/entity/Declaration";
import User from "@/entity/User";

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
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id);
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
    userId: user.id,
    eventId: event.id,
    isFinished: false,
  });
  if (declaration == null) {
    await interaction.reply({
      content: "凸宣言がされていません",
      ephemeral: true,
    });
    return;
  }

  const eventBossRepository = DataSource.getRepository(EventBoss);
  const eventBoss = await eventBossRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (eventBoss == null) {
    throw new Error("クランバトルボスのHP情報が取得できませんでした");
  }
  let remainingHp = 0;
  switch (boss.bossid) {
    case 1:
      remainingHp = eventBoss?.boss1HP ?? 0;
      break;
    case 2:
      remainingHp = eventBoss?.boss2HP ?? 0;
      break;
    case 3:
      remainingHp = eventBoss?.boss3HP ?? 0;
      break;
    case 4:
      remainingHp = eventBoss?.boss4HP ?? 0;
      break;
    case 5:
      remainingHp = eventBoss?.boss5HP ?? 0;
      break;
    default:
      break;
  }
  const modal = await reportShave.createModal(remainingHp);
  await interaction.showModal(modal);
}

export default {
  customId,
  data,
  execute,
};
