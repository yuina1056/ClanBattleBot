/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Lap from "@/entity/Lap";
import {
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  Guild,
} from "discord.js";
import DataSource from "@/repository/repository";
import { Modal } from "@/commands/modal/modal";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { LapRepository } from "@/repository/lapRepository";

interface FormBossLap {
  boss1Lap: string;
  boss2Lap: string;
  boss3Lap: string;
  boss4Lap: string;
  boss5Lap: string;
}

interface BossLap {
  boss1Lap: number;
  boss2Lap: number;
  boss3Lap: number;
  boss4Lap: number;
  boss5Lap: number;
}

export class ModalEditLap extends Modal {
  static readonly customId = "edit_lap_submit";
  text_boss1_lap_customId = "boss1_lap";
  text_boss2_lap_customId = "boss2_lap";
  text_boss3_lap_customId = "boss3_lap";
  text_boss4_lap_customId = "boss4_lap";
  text_boss5_lap_customId = "boss5_lap";

  createModal(lap: Lap): ModalBuilder {
    const modal = new ModalBuilder().setTitle("周回数修正").setCustomId(ModalEditLap.customId);
    const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("1ボス周回数(数値のみ)")
        .setCustomId(this.text_boss1_lap_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(lap.boss1Lap!.toString())
        .setRequired(true),
    );
    const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("2ボス周回数(数値のみ)")
        .setCustomId(this.text_boss2_lap_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(lap.boss2Lap!.toString())
        .setRequired(true),
    );
    const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("3ボス周回数(数値のみ)")
        .setCustomId(this.text_boss3_lap_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(lap.boss3Lap!.toString())
        .setRequired(true),
    );
    const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("4ボス周回数(数値のみ)")
        .setCustomId(this.text_boss4_lap_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(lap.boss4Lap!.toString())
        .setRequired(true),
    );
    const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("5ボス周回数(数値のみ)")
        .setCustomId(this.text_boss5_lap_customId)
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

  async submit(interaction: ModalSubmitInteraction) {
    const formLap: FormBossLap = {
      boss1Lap: interaction.fields.getTextInputValue(this.text_boss1_lap_customId),
      boss2Lap: interaction.fields.getTextInputValue(this.text_boss2_lap_customId),
      boss3Lap: interaction.fields.getTextInputValue(this.text_boss3_lap_customId),
      boss4Lap: interaction.fields.getTextInputValue(this.text_boss4_lap_customId),
      boss5Lap: interaction.fields.getTextInputValue(this.text_boss5_lap_customId),
    };
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
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    // クラン取得
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    const lap = await new LapRepository().getLapByEventIdAndClanId(event.id!, clan.id!);
    if (lap == null) {
      throw new Error("周回数情報が取得できませんでした");
    }

    const bossLap = this.validateForm(formLap);
    if (bossLap instanceof Error) {
      await interaction.reply({
        content: bossLap.message,
        ephemeral: true,
      });
      return;
    }

    lap.boss1Lap = bossLap.boss1Lap;
    lap.boss2Lap = bossLap.boss2Lap;
    lap.boss3Lap = bossLap.boss3Lap;
    lap.boss4Lap = bossLap.boss4Lap;
    lap.boss5Lap = bossLap.boss5Lap;

    const lapRepository = DataSource.getRepository(Lap);
    await lapRepository.save(lap);
    await interaction.reply({
      content: "周回数が変更されました",
      ephemeral: true,
    });
  }

  validateForm(formLap: FormBossLap): BossLap | Error {
    const boss1Lap = Number(formLap.boss1Lap);
    const boss2Lap = Number(formLap.boss2Lap);
    const boss3Lap = Number(formLap.boss3Lap);
    const boss4Lap = Number(formLap.boss4Lap);
    const boss5Lap = Number(formLap.boss5Lap);
    if (isNaN(boss1Lap)) {
      return new Error("1ボスの周回数の入力値が数値ではありません。");
    }
    if (isNaN(boss2Lap)) {
      return new Error("2ボスの周回数の入力値が数値ではありません。");
    }
    if (isNaN(boss3Lap)) {
      return new Error("3ボスの周回数の入力値が数値ではありません。");
    }
    if (isNaN(boss4Lap)) {
      return new Error("4ボスの周回数の入力値が数値ではありません。");
    }
    if (isNaN(boss5Lap)) {
      return new Error("5ボスの周回数の入力値が数値ではありません。");
    }
    if (boss1Lap < 0) {
      return new Error("1ボスの周回数の入力値が0未満です。");
    }
    if (boss2Lap < 0) {
      return new Error("2ボスの周回数の入力値が0未満です。");
    }
    if (boss3Lap < 0) {
      return new Error("3ボスの周回数の入力値が0未満です。");
    }
    if (boss4Lap < 0) {
      return new Error("4ボスの周回数の入力値が0未満です。");
    }
    if (boss5Lap < 0) {
      return new Error("5ボスの周回数の入力値が0未満です。");
    }
    return {
      boss1Lap,
      boss2Lap,
      boss3Lap,
      boss4Lap,
      boss5Lap,
    };
  }
}
