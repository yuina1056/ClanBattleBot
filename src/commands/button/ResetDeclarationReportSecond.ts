import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";
import dayjs from "dayjs";

export const customId = "reset_declaration_report_second";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("2凸目リセット");

import DataSource from "@/datasource";
import Clan from "@/entity/Clan";
import User from "@/entity/User";
import Declaration from "@/entity/Declaration";
import Event from "@/entity/Event";
import Report from "@/entity/Report";


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
    discordUserId: interaction.user.id,
    clanId: clan.id,
  });
  if (user == null) {
    throw new Error("ユーザー情報が取得できませんでした");
  }

  // 削除処理
  await DataSource.getRepository(Declaration)
    .createQueryBuilder("declaration")
    .delete()
    .where("declaration.userId = :userId", { userId: user.id })
    .andWhere("declaration.eventId = :eventId", { eventId: event.id })
    .andWhere("declaration.day = :day", { day: event.getClanBattleDay() })
    .andWhere("declaration.attackCount = :attackCount", { attackCount: 2 })
    .execute();
  await DataSource.getRepository(Report)
    .createQueryBuilder("report")
    .delete()
    .where("report.userId = :userId", { userId: user.id })
    .andWhere("report.eventId = :eventId", { eventId: event.id })
    .andWhere("report.day = :day", { day: event.getClanBattleDay() })
    .andWhere("report.attackCount = :attackCount", { attackCount: 2 })
    .execute();

  await interaction.reply({
    content: "2凸目の宣言・報告をリセットしました。",
    ephemeral: true,
  });
}

export default {
  customId,
  data,
  execute,
};
