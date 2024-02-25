import BossChannelMessage from "@/messages/BossChannelMessage";
import {
  ActionRowBuilder,
  Guild,
  ModalBuilder,
  ModalSubmitInteraction,
  TextBasedChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import Config from "@/config/config";
import { Modal } from "@/commands/modal/modal";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { UserRepository } from "@/repository/userRepository";
import { ReportRepository } from "@/repository/reportRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";
import ClanEvent from "@/entity/ClanEvent";

interface FormReportShaveHP {
  remaining_hp: string;
}

interface ReportShaveHP {
  remaining_hp: number;
}

export class ModalReportShaveHP extends Modal {
  static readonly customId = "report_shave";
  text_remaining_hp_customId = "remaining_hp";

  createModal(hp: number): ModalBuilder {
    const modal = new ModalBuilder()
      .setTitle("凸報告：残HP報告")
      .setCustomId(ModalReportShaveHP.customId);
    const ActionRowRemainingHP = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setLabel("残HP(万)(数値のみ)")
        .setCustomId(this.text_remaining_hp_customId)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(1)
        .setPlaceholder(hp.toString())
        .setRequired(true),
    );
    modal.addComponents(ActionRowRemainingHP);
    return modal;
  }

  async submit(interaction: ModalSubmitInteraction) {
    const formReportShaveHP: FormReportShaveHP = {
      remaining_hp: interaction.fields.getTextInputValue(this.text_remaining_hp_customId),
    };
    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    let interactionChannel: TextBasedChannel;
    if (interaction.channel != null) {
      interactionChannel = interaction.channel;
    } else {
      throw new Error("interaction.channel is null");
    }
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    if (event.id == null) {
      throw new Error("event.id is null");
    }
    const channel = guild.channels.cache.find((channel) => channel.id === interactionChannel.id);
    if (channel == null) {
      throw new Error("channel is null");
    }
    if (channel.parentId == null) {
      throw new Error("channel.parentId is null");
    }
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    if (clan.id == null) {
      throw new Error("クランIDが取得できませんでした");
    }
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id ?? 0,
      interactionChannel.id,
    );
    if (boss == null) {
      throw new Error("ボス情報が取得できませんでした");
    }

    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id,
      event.id,
    );
    if (clanEvent == null) {
      throw new Error("周回数が取得できませんでした");
    }
    // ユーザー取得
    const user = await new UserRepository().getUserByDiscordUserIdAndClanId(
      interaction.user.id,
      clan.id,
    );
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }
    if (user.id == null) {
      throw new Error("ユーザーIDが取得できませんでした");
    }

    const ReportShaveHP = this.validateForm(formReportShaveHP, clanEvent, boss.bossNo);
    if (ReportShaveHP instanceof Error) {
      await interaction.reply({
        content: "撃破処理に失敗しました。[Error:" + ReportShaveHP.message + "]",
        ephemeral: true,
      });
      return;
    }
    let bossLap = 0;
    switch (boss.bossNo) {
      case 1:
        bossLap = clanEvent.boss1Lap ?? 0;
        clanEvent.boss1HP = ReportShaveHP.remaining_hp;
        break;
      case 2:
        bossLap = clanEvent.boss1Lap ?? 0;
        clanEvent.boss2HP = ReportShaveHP.remaining_hp;
        break;
      case 3:
        bossLap = clanEvent.boss3Lap ?? 0;
        clanEvent.boss3HP = ReportShaveHP.remaining_hp;
        break;
      case 4:
        bossLap = clanEvent.boss4Lap ?? 0;
        clanEvent.boss4HP = ReportShaveHP.remaining_hp;
        break;
      case 5:
        bossLap = clanEvent.boss5Lap ?? 0;
        clanEvent.boss5HP = ReportShaveHP.remaining_hp;
        break;
      default:
        break;
    }

    const declaration =
      await new DeclarationRepository().getDeclarationByUserIdAndClanIdAndEventIdAndDayAndIsFinished(
        user.id,
        clan.id,
        event.id,
        event.getClanBattleDay(),
        false,
      );
    if (declaration == null) {
      await interaction.reply({
        content: "凸宣言がされていません",
        ephemeral: true,
      });
      return;
    }
    if (declaration.id == null) {
      throw new Error("declaration.id is null");
    }
    await new DeclarationRepository().updateIsFinishedById(declaration.id, true);

    // DBに保存
    await new ReportRepository().create(
      user.clanId,
      user.id,
      event.id,
      boss.bossNo,
      bossLap,
      event.getClanBattleDay(),
      declaration.attackCount,
      declaration.isAttackCarryOver,
      0,
      false,
      false,
    );

    const saveClanEvent = await new ClanEventRepository().save(clanEvent);

    const declarations =
      await new DeclarationRepository().getDeclarationsByClanIdAndBossNoAndIsFinishedAndEventIdToRelationUser(
        clan.id,
        boss.bossNo,
        false,
        event.id,
      );
    await BossChannelMessage.sendMessage(
      interactionChannel,
      clan,
      boss,
      saveClanEvent,
      declarations,
    );
    const deleteMessage = await channel.messages.fetch(interaction.message?.id ?? "");
    await deleteMessage.delete();
    if (!channel.isTextBased()) {
      throw new Error("interaction.channel is not TextBasedChannel");
    }
    await interaction.deferUpdate();
    await channel.send({
      content: "【" + bossLap + "周目】" + user.name + "が" + boss.bossNo + "ボスを削りました",
    });
  }

  validateForm(
    formReportShaveHP: FormReportShaveHP,
    clanEvent: ClanEvent,
    bossNo: number,
  ): ReportShaveHP | Error {
    const remaining_hp = Number(formReportShaveHP.remaining_hp);
    if (isNaN(remaining_hp)) {
      return new Error("残HPの入力値が数値ではありません。数値を入力してください。");
    }
    if (remaining_hp <= 0) {
      return new Error("残HPが0になる時は撃破ボタンを押して報告してください。");
    }
    switch (bossNo) {
      case 1:
        if (Config.BossHPConfig.boss1HP[clanEvent.getCurrentStage(1)] < remaining_hp) {
          return new Error("1ボスの残HPがボスの最大HPを超えています");
        }
        break;
      case 2:
        if (Config.BossHPConfig.boss2HP[clanEvent.getCurrentStage(2)] < remaining_hp) {
          return new Error("2ボスの残HPがボスの最大HPを超えています");
        }
        break;
      case 3:
        if (Config.BossHPConfig.boss3HP[clanEvent.getCurrentStage(3)] < remaining_hp) {
          return new Error("3ボスの残HPがボスの最大HPを超えています");
        }
        break;
      case 4:
        if (Config.BossHPConfig.boss4HP[clanEvent.getCurrentStage(4)] < remaining_hp) {
          return new Error("4ボスの残HPがボスの最大HPを超えています");
        }
        break;
      case 5:
        if (Config.BossHPConfig.boss5HP[clanEvent.getCurrentStage(5)] < remaining_hp) {
          return new Error("5ボスの残HPがボスの最大HPを超えています");
        }
        break;
      default:
        return new Error("ボスIDが不正です");
    }
    return {
      remaining_hp,
    };
  }
}
