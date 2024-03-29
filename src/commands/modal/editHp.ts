import {
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  Guild,
} from "discord.js";
import Config from "@/config/config";
import { Modal } from "@/commands/modal/modal";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import ClanEvent from "@/entity/ClanEvent";
import { ClanEventRepository } from "@/repository/clanEventRepository";

interface FormBossHP {
  boss1HP: string;
  boss2HP: string;
  boss3HP: string;
  boss4HP: string;
  boss5HP: string;
}

interface BossHP {
  boss1HP: number;
  boss2HP: number;
  boss3HP: number;
  boss4HP: number;
  boss5HP: number;
}

export class ModalEditHp extends Modal {
  static readonly customId = "edit_hp_submit";

  text_boss1_hp_customId = "boss1_hp";
  text_boss2_hp_customId = "boss2_hp";
  text_boss3_hp_customId = "boss3_hp";
  text_boss4_hp_customId = "boss4_hp";
  text_boss5_hp_customId = "boss5_hp";

  createModal(clanEvent: ClanEvent): ModalBuilder {
    if (clanEvent.boss1HP == null) {
      throw new Error("1ボスHPが取得できませんでした");
    }
    if (clanEvent.boss2HP == null) {
      throw new Error("2ボスHPが取得できませんでした");
    }
    if (clanEvent.boss3HP == null) {
      throw new Error("3ボスHPが取得できませんでした");
    }
    if (clanEvent.boss4HP == null) {
      throw new Error("4ボスHPが取得できませんでした");
    }
    if (clanEvent.boss5HP == null) {
      throw new Error("5ボスHPが取得できませんでした");
    }
    const modal = new ModalBuilder().setTitle("ボスHP修正").setCustomId(ModalEditHp.customId);
    const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("1ボスHP(万)(数値のみ)")
        .setCustomId(this.text_boss1_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(clanEvent.boss1HP.toString())
        .setRequired(true),
    );
    const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("2ボスHP(万)(数値のみ)")
        .setCustomId(this.text_boss2_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(clanEvent.boss2HP.toString())
        .setRequired(true),
    );
    const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("3ボスHP(万)(数値のみ)")
        .setCustomId(this.text_boss3_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(clanEvent.boss3HP.toString())
        .setRequired(true),
    );
    const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("4ボスHP(万)(数値のみ)")
        .setCustomId(this.text_boss4_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(clanEvent.boss4HP.toString())
        .setRequired(true),
    );
    const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("5ボスHP(万)(数値のみ)")
        .setCustomId(this.text_boss5_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setValue(clanEvent.boss5HP.toString())
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
    const formBossHP: FormBossHP = {
      boss1HP: interaction.fields.getTextInputValue(this.text_boss1_hp_customId),
      boss2HP: interaction.fields.getTextInputValue(this.text_boss2_hp_customId),
      boss3HP: interaction.fields.getTextInputValue(this.text_boss3_hp_customId),
      boss4HP: interaction.fields.getTextInputValue(this.text_boss4_hp_customId),
      boss5HP: interaction.fields.getTextInputValue(this.text_boss5_hp_customId),
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
    if (event.id == null) {
      throw new Error("event.id is null");
    }
    // クラン取得
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    if (clan.id == null) {
      throw new Error("クランIDが取得できませんでした");
    }
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id,
      event.id,
    );
    if (clanEvent == null) {
      throw new Error("クラン毎イベント情報が取得できませんでした");
    }

    const bossHP = this.validateForm(formBossHP, clanEvent);
    if (bossHP instanceof Error) {
      await interaction.reply({
        content: "ボスHP修正に失敗しました。" + bossHP.message,
        ephemeral: true,
      });
      return;
    }

    clanEvent.boss1HP = bossHP.boss1HP;
    clanEvent.boss2HP = bossHP.boss2HP;
    clanEvent.boss3HP = bossHP.boss3HP;
    clanEvent.boss4HP = bossHP.boss4HP;
    clanEvent.boss5HP = bossHP.boss5HP;

    await new ClanEventRepository().save(clanEvent);
    await interaction.reply({
      content: "各ボスの残HPが変更されました。",
      ephemeral: true,
    });
  }

  validateForm(formHP: FormBossHP, clanEvent: ClanEvent): BossHP | Error {
    const boss1HP = Number(formHP.boss1HP);
    const boss2HP = Number(formHP.boss2HP);
    const boss3HP = Number(formHP.boss3HP);
    const boss4HP = Number(formHP.boss4HP);
    const boss5HP = Number(formHP.boss5HP);
    if (isNaN(boss1HP)) {
      return new Error("1ボスのHPの入力値が数値ではありません。");
    }
    if (isNaN(boss2HP)) {
      return new Error("2ボスのHPの入力値が数値ではありません。");
    }
    if (isNaN(boss3HP)) {
      return new Error("3ボスのHPの入力値が数値ではありません。");
    }
    if (isNaN(boss4HP)) {
      return new Error("4ボスのHPの入力値が数値ではありません。");
    }
    if (isNaN(boss5HP)) {
      return new Error("5ボスのHPの入力値が数値ではありません。");
    }
    if (Config.BossHPConfig.boss1HP[clanEvent.getCurrentStage(1)] < boss1HP) {
      return new Error("1ボスのHPの入力値が最大値を超えています。");
    }
    if (Config.BossHPConfig.boss2HP[clanEvent.getCurrentStage(2)] < boss2HP) {
      return new Error("2ボスのHPの入力値が最大値を超えています。");
    }
    if (Config.BossHPConfig.boss3HP[clanEvent.getCurrentStage(3)] < boss3HP) {
      return new Error("3ボスのHPの入力値が最大値を超えています。");
    }
    if (Config.BossHPConfig.boss4HP[clanEvent.getCurrentStage(4)] < boss4HP) {
      return new Error("4ボスのHPの入力値が最大値を超えています。");
    }
    if (Config.BossHPConfig.boss5HP[clanEvent.getCurrentStage(5)] < boss5HP) {
      return new Error("5ボスのHPの入力値が最大値を超えています。");
    }
    return {
      boss1HP,
      boss2HP,
      boss3HP,
      boss4HP,
      boss5HP,
    };
  }
}
