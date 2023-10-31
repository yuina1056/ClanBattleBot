import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  Guild,
} from "discord.js";
import dayjs from "dayjs";

import DataSource from "@/datasource";
import User from "@/entity/User";
import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";
import Lap from "@/entity/Lap";
import Declaration from "@/entity/Declaration";
import BossChannelMessage from "@/messages/BossChannelMessage";

export const customId = "declaration_cancel";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Danger)
  .setLabel("取消");

export async function execute(interaction: ButtonInteraction) {
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
  }
  if (interaction.channel == null) {
    throw new Error("interaction.channel is null");
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    discordChannelId: interaction.channel.id,
  });
  if (boss == null) {
    throw new Error("ボス情報が取得できませんでした");
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
  });
  if (user == null) {
    throw new Error("ユーザー情報が取得できませんでした");
  }

  // DBから削除
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findOneBy({
    userId: user.id,
    isFinished: false,
  });
  if (declaration == null) {
    await interaction.reply({ content: "取り消しする凸宣言がありません" });
    return;
  }
  if (declaration.id == null) {
    throw new Error("declaration.id is null");
  }
  await declarationRepository.delete(declaration.id);

  const channel = guild.channels.cache.find((channel) => {
    return channel.id === interaction.channel?.id;
  });
  if (channel == null) {
    throw new Error("channel is null");
  }
  if (channel.parentId == null) {
    throw new Error("channel.parentId is null");
  }
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
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

  // 周回数取得
  const lapRepository = DataSource.getRepository(Lap);
  const lap = await lapRepository.findOneBy({
    eventId: event.id,
    clanId: clan.id,
  });

  const declarations = await declarationRepository.find({
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
    lap,
    declarations,
  );
  await interaction.reply({ content: "凸宣言取消しました", ephemeral: true });
  await interaction.message.delete();
}

export default {
  customId,
  data,
  execute,
};
