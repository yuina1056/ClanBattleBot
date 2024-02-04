/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import { ModalReportShaveHP } from "@/commands/modal/reportShave";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
// import { EventBossRepository } from "@/repository/eventBossRepository";
import { UserRepository } from "@/repository/userRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";

export class ReportShave extends Button {
  static readonly customId = "report_shave";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(ReportShave.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("削り");
  }

  async execute(interaction: ButtonInteraction) {
    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id);
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel!.parentId!);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id ?? 0,
      interaction.channel!.id,
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
        content: "凸宣言がされていません",
        ephemeral: true,
      });
      return;
    }

    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id!,
      event.id!,
    );
    if (clanEvent == null) {
      throw new Error("クラン毎のイベント情報が取得できませんでした");
    }
    let remainingHp = 0;
    switch (boss.bossid) {
      case 1:
        remainingHp = clanEvent.boss1HP ?? 0;
        break;
      case 2:
        remainingHp = clanEvent.boss2HP ?? 0;
        break;
      case 3:
        remainingHp = clanEvent.boss3HP ?? 0;
        break;
      case 4:
        remainingHp = clanEvent.boss4HP ?? 0;
        break;
      case 5:
        remainingHp = clanEvent.boss5HP ?? 0;
        break;
      default:
        break;
    }
    const modal = new ModalReportShaveHP().createModal(remainingHp);
    await interaction.showModal(modal);
  }
}
