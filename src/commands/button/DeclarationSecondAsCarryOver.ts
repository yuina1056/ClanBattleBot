import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  Guild,
} from "discord.js";
import dayjs from "dayjs";

import Declaration from "@/app/model/Declaration";
import DataSource from "@/datasource";
import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Lap from "@/entity/Lap";
import Event from "@/entity/Event";
import DeclarationRepository from "@/entity/Declaration";
import BossChannelMessage from "@/messages/BossChannelMessage";

export const customId = "declarationSecondAsCarryOver";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Danger)
  .setLabel("2凸目持越");

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
  const channel = guild.channels.cache.find(
    (channel) => channel.id === interaction.channel?.id
  );
  if (channel == null) {
    throw new Error("チャンネル情報が取得できませんでした");
  }
  if (channel.parentId == null) {
    throw new Error("親カテゴリ情報が取得できませんでした");
  }
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    clanId: clan.id,
    discordChannelId: interaction.channel.id,
  });
  if (boss == null) {
    throw new Error("ボス情報が取得できませんでした");
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
  let content = "";
  const user = await Declaration.regist(boss, interaction.user.id, 2);
  if (user instanceof Error) {
    content = user.message;
  } else {
    content = user?.name + "が" + boss.bossid + "ボスに凸宣言しました";
  }

  const declarations = await DataSource.getRepository(
    DeclarationRepository
  ).find({
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
    declarations
  );
  const deleteMessage = await channel.messages.fetch(
    interaction.message.reference?.messageId ?? ""
  );
  await deleteMessage.delete();
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute,
};
