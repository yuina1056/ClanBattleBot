/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import DataSource from "@/repository/repository";
import User from "@/entity/User";
import BossChannelMessage from "@/messages/BossChannelMessage";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { LapRepository } from "@/repository/lapRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { EventBossRepository } from "@/repository/eventBossRepository";

export class DeclarationCancel extends Button {
  static readonly customId: string = "declaration_cancel";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationCancel.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("取消");
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
    const channel = guild.channels.cache.find((channel) => {
      return channel.id === interaction.channel?.id;
    });
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
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id ?? 0,
      interaction.channel.id,
    );
    if (boss == null) {
      throw new Error("ボス情報が取得できませんでした");
    }
    // ユーザー取得
    const userRepository = DataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      clanId: clan.id,
      discordUserId: interaction.user.id,
    });
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }

    // DBから削除
    const declaration =
      await new DeclarationRepository().getDeclarationByClanIdAndUserIdAndIsFinished(
        clan.id!,
        user.id!,
        false,
      );
    if (declaration == null) {
      await interaction.reply({
        content: "取り消しする凸宣言がありません",
        ephemeral: true,
      });
      return;
    }
    if (declaration.id == null) {
      throw new Error("declaration.id is null");
    }
    await new DeclarationRepository().deleteById(declaration.id);

    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }

    // 周回数取得
    const lap = await new LapRepository().getLapByEventIdAndClanId(event.id!, clan.id!);
    const eventBoss = await new EventBossRepository().getEventBossByClanIdAndEventId(
      event.id!,
      clan.id!,
    );
    if (eventBoss == null) {
      throw new Error("クランバトルボスのHP情報が取得できませんでした");
    }

    const declarations =
      await new DeclarationRepository().getDeclarationsByBossIdAndIsFinishedToRelationUser(
        boss.id!,
        false,
      );
    await BossChannelMessage.sendMessage(
      interaction.channel,
      clan,
      boss,
      eventBoss,
      lap,
      declarations,
    );
    await interaction.reply({ content: "凸宣言取消しました", ephemeral: true });
    await interaction.message.delete();
  }
}
