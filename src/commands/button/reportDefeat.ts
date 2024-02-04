/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import BossChannelMessage from "@/messages/BossChannelMessage";
import Config from "@/config/config";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { UserRepository } from "@/repository/userRepository";
import { ReportRepository } from "@/repository/reportRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";

export class ReportDefeat extends Button {
  static readonly customId = "report_defeat";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(ReportDefeat.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("撃破");
  }

  async execute(interaction: ButtonInteraction) {
    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    if (interaction.channel == null) {
      throw new Error("interaction.channel is null");
    }
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
    if (channel == null) {
      throw new Error("channel is null");
    }
    if (channel.parentId == null) {
      throw new Error("channel.parentId is null");
    }
    // クラン取得
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id ?? 0,
      interaction.channel.id,
    );
    if (boss == null) {
      throw new Error("ボス情報が取得できませんでした");
    }
    // ユーザー取得
    const user = await new UserRepository().getUserByDiscordUserIdAndClanId(
      interaction.user.id,
      clan.id!,
    );
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }
    // 凸宣言取得
    const declaration =
      await new DeclarationRepository().getDeclarationByUserIdAndClanIdAndEventIdAndDayAndIsFinished(
        user.id!,
        clan.id!,
        event.id!,
        event.getClanBattleDay(),
        false,
      );
    if (declaration == null) {
      await interaction.reply({
        content: "凸宣言がされていません。先に凸宣言を行ってください。",
        ephemeral: true,
      });
      return;
    }
    if (declaration.id == null) {
      throw new Error("declaration.id is null");
    }
    // 対象凸を完了状態にする
    await new DeclarationRepository().updateIsFinishedById(declaration.id, true);

    // 周回数・HP更新
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      event.id!,
      clan.id!,
    );
    if (clanEvent == null) {
      throw new Error("クラン毎イベント情報が取得できませんでした");
    }
    let bossLap = 0;

    switch (boss.bossNo) {
      case 1:
        if (clanEvent.boss1Lap == null) {
          throw new Error("lap.boss1Lap is null");
        }
        bossLap = clanEvent.boss1Lap;
        clanEvent.boss1Lap += 1;
        clanEvent.boss1HP = Config.BossHPConfig.boss1HP[clanEvent.getCurrentStage(1)];
        break;
      case 2:
        if (clanEvent.boss2Lap == null) {
          throw new Error("lap.boss2Lap is null");
        }
        bossLap = clanEvent.boss2Lap;
        clanEvent.boss2Lap += 1;
        clanEvent.boss2HP = Config.BossHPConfig.boss2HP[clanEvent.getCurrentStage(2)];
        break;
      case 3:
        if (clanEvent.boss3Lap == null) {
          throw new Error("lap.boss3Lap is null");
        }
        bossLap = clanEvent.boss3Lap;
        clanEvent.boss3Lap += 1;
        clanEvent.boss3HP = Config.BossHPConfig.boss3HP[clanEvent.getCurrentStage(3)];
        break;
      case 4:
        if (clanEvent.boss4Lap == null) {
          throw new Error("lap.boss4Lap is null");
        }
        bossLap = clanEvent.boss4Lap;
        clanEvent.boss4Lap += 1;
        clanEvent.boss4HP = Config.BossHPConfig.boss4HP[clanEvent.getCurrentStage(4)];
        break;
      case 5:
        if (clanEvent.boss5Lap == null) {
          throw new Error("lap.boss5Lap is null");
        }
        bossLap = clanEvent.boss5Lap;
        clanEvent.boss5Lap += 1;
        clanEvent.boss5HP = Config.BossHPConfig.boss5HP[clanEvent.getCurrentStage(5)];
        break;
      default:
        break;
    }
    await new ClanEventRepository().save(clanEvent);

    // 持ち越しが発生しているかチェック
    let isCarryOver = false;
    const reports = await new ReportRepository().getReportsByUserIdAndEventIdAndDayAndAttackCount(
      user.id!,
      event.id!,
      declaration.day,
      declaration.attackCount,
    );
    if (reports.length === 0) {
      isCarryOver = true;
    }

    // DBに保存
    await new ReportRepository().create(
      user.clanId,
      user.id!,
      event.id!,
      boss.bossNo,
      bossLap,
      event.getClanBattleDay(),
      declaration.attackCount,
      declaration.isAttackCarryOver,
      0,
      true,
      isCarryOver,
    );

    const declarations =
      await new DeclarationRepository().getDeclarationsByClanIdAndbossNoAndIsFinishedToRelationUser(
        clan.id!,
        boss.bossNo!,
        false,
      );
    const deleteMessage = await channel.messages.fetch(interaction.message.id ?? "");
    await deleteMessage.delete();
    await BossChannelMessage.sendMessage(interaction.channel, clan, boss, clanEvent, declarations);
    if (!channel.isTextBased()) {
      throw new Error("interaction.channel is not TextBasedChannel");
    }
    await interaction.deferUpdate();
    await channel.send({
      content: "【" + bossLap + "周目】" + user.name + "が" + boss.bossNo + "ボスを撃破しました",
    });
  }
}
