/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import DataSource from "@/repository/datasource";
import Clan from "@/entity/Clan";
import { ModalReportShaveHP } from "@/commands/modal/reportShave";
import EventBoss from "@/entity/EventBoss";
import Declaration from "@/entity/Declaration";
import User from "@/entity/User";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";

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
    const clan = await DataSource.getRepository(Clan).findOneBy({
      discordCategoryId: channel!.parentId!,
    });
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
    const userRepository = DataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      discordUserId: interaction.user.id,
      clanId: clan.id,
    });
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }
    // 凸宣言取得
    const declarationRepository = DataSource.getRepository(Declaration);
    const declaration = await declarationRepository.findOneBy({
      userId: user.id,
      clanId: clan.id,
      eventId: event.id,
      day: event.getClanBattleDay(),
      isFinished: false,
    });
    if (declaration == null) {
      await interaction.reply({
        content: "凸宣言がされていません",
        ephemeral: true,
      });
      return;
    }

    const eventBossRepository = DataSource.getRepository(EventBoss);
    const eventBoss = await eventBossRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
    if (eventBoss == null) {
      throw new Error("クランバトルボスのHP情報が取得できませんでした");
    }
    let remainingHp = 0;
    switch (boss.bossid) {
      case 1:
        remainingHp = eventBoss.boss1HP ?? 0;
        break;
      case 2:
        remainingHp = eventBoss.boss2HP ?? 0;
        break;
      case 3:
        remainingHp = eventBoss.boss3HP ?? 0;
        break;
      case 4:
        remainingHp = eventBoss.boss4HP ?? 0;
        break;
      case 5:
        remainingHp = eventBoss.boss5HP ?? 0;
        break;
      default:
        break;
    }
    const modal = new ModalReportShaveHP().createModal(remainingHp);
    await interaction.showModal(modal);
  }
}
