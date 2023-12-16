/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Clan from "@/entity/Clan";
import Lap from "@/entity/Lap";
import Event from "@/entity/Event";
import dayjs from "dayjs";
import {
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  Guild,
} from "discord.js";
import DataSource from "@/datasource";

export const customId = "edit_lap_submit";
const text_boss1_lap_customId = "boss1_lap";
const text_boss2_lap_customId = "boss2_lap";
const text_boss3_lap_customId = "boss3_lap";
const text_boss4_lap_customId = "boss4_lap";
const text_boss5_lap_customId = "boss5_lap";

export async function createModal(lap: Lap): Promise<ModalBuilder> {
  const modal = new ModalBuilder().setTitle("周回数修正").setCustomId(customId);
  const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("1ボス周回数(数値のみ)")
      .setCustomId(text_boss1_lap_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss1Lap!.toString())
      .setRequired(true),
  );
  const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("2ボス周回数(数値のみ)")
      .setCustomId(text_boss2_lap_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss2Lap!.toString())
      .setRequired(true),
  );
  const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("3ボス周回数(数値のみ)")
      .setCustomId(text_boss3_lap_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss3Lap!.toString())
      .setRequired(true),
  );
  const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("4ボス周回数(数値のみ)")
      .setCustomId(text_boss4_lap_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss4Lap!.toString())
      .setRequired(true),
  );
  const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("5ボス周回数(数値のみ)")
      .setCustomId(text_boss5_lap_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss5Lap!.toString())
      .setRequired(true),
  );

  modal.addComponents(
    ActionRowBoss1,
    ActionRowBoss2,
    ActionRowBoss3,
    ActionRowBoss4,
    ActionRowBoss5,
  );
  return modal;
}

export async function submit(interaction: ModalSubmitInteraction) {
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
  }
  if (interaction.channel == null) {
    throw new Error("interaction.channel is null");
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
  if (channel == null) {
    throw new Error("channel is null");
  }
  if (channel.parentId == null) {
    throw new Error("channel.parentId is null");
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
  // クラン取得
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
  }
  const lapRepository = DataSource.getRepository(Lap);
  const lap = await lapRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (lap == null) {
    throw new Error("周回数情報が取得できませんでした");
  }

  const boss1Lap = Number(interaction.fields.getTextInputValue(text_boss1_lap_customId));
  const boss2Lap = Number(interaction.fields.getTextInputValue(text_boss2_lap_customId));
  const boss3Lap = Number(interaction.fields.getTextInputValue(text_boss3_lap_customId));
  const boss4Lap = Number(interaction.fields.getTextInputValue(text_boss4_lap_customId));
  const boss5Lap = Number(interaction.fields.getTextInputValue(text_boss5_lap_customId));
  if (isNaN(boss1Lap)) {
    await interaction.reply({
      content: "1ボスの周回数が不正です。数値を入力してください。",
      ephemeral: true,
    });
    return;
  }
  if (isNaN(boss2Lap)) {
    await interaction.reply({
      content: "2ボスの周回数が不正です。数値を入力してください。",
      ephemeral: true,
    });
    return;
  }
  if (isNaN(boss3Lap)) {
    await interaction.reply({
      content: "3ボスの周回数が不正です。数値を入力してください。",
      ephemeral: true,
    });
    return;
  }
  if (isNaN(boss4Lap)) {
    await interaction.reply({
      content: "4ボスの周回数が不正です。数値を入力してください。",
      ephemeral: true,
    });
    return;
  }
  if (isNaN(boss5Lap)) {
    await interaction.reply({
      content: "5ボスの周回数が不正です。数値を入力してください。",
      ephemeral: true,
    });
    return;
  }
  
  lap.boss1Lap = boss1Lap;
  lap.boss2Lap = boss2Lap;
  lap.boss3Lap = boss3Lap;
  lap.boss4Lap = boss4Lap;
  lap.boss5Lap = boss5Lap;

  await lapRepository.save(lap);
  await interaction.reply({
    content: "周回数が変更されました",
    ephemeral: true,
  });
}

export default {
  customId,
  createModal,
  submit,
};
