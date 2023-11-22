/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Clan from "@/entity/Clan";
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
import EventBoss from "@/entity/EventBoss";

export const customId = "edit_hp_submit";
const text_boss1_hp_customId = "boss1_hp";
const text_boss2_hp_customId = "boss2_hp";
const text_boss3_hp_customId = "boss3_hp";
const text_boss4_hp_customId = "boss4_hp";
const text_boss5_hp_customId = "boss5_hp";

export async function createModal(eventBoss: EventBoss): Promise<ModalBuilder> {
  const modal = new ModalBuilder().setTitle("周回数修正").setCustomId(customId);
  const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("1ボス周回数")
      .setCustomId(text_boss1_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(eventBoss.boss1HP!.toString())
      .setRequired(true),
  );
  const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("2ボス周回数")
      .setCustomId(text_boss2_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(eventBoss.boss2HP!.toString())
      .setRequired(true),
  );
  const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("3ボス周回数")
      .setCustomId(text_boss3_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(eventBoss.boss3HP!.toString())
      .setRequired(true),
  );
  const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("4ボス周回数")
      .setCustomId(text_boss4_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(eventBoss.boss4HP!.toString())
      .setRequired(true),
  );
  const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("5ボス周回数")
      .setCustomId(text_boss5_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(eventBoss.boss5HP!.toString())
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
  const eventBossRepository = DataSource.getRepository(EventBoss);
  const eventBoss = await eventBossRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (eventBoss == null) {
    throw new Error("クランバトルボスのHP情報が取得できませんでした");
  }
  eventBoss.boss1HP = Number(interaction.fields.getTextInputValue(text_boss1_hp_customId));
  eventBoss.boss2HP = Number(interaction.fields.getTextInputValue(text_boss2_hp_customId));
  eventBoss.boss3HP = Number(interaction.fields.getTextInputValue(text_boss3_hp_customId));
  eventBoss.boss4HP = Number(interaction.fields.getTextInputValue(text_boss4_hp_customId));
  eventBoss.boss5HP = Number(interaction.fields.getTextInputValue(text_boss5_hp_customId));

  await eventBossRepository.save(eventBoss);
  await interaction.reply({
    content: "各ボスの残HPが変更されました",
    ephemeral: true,
  });
}

export default {
  customId,
  createModal,
  submit,
};
