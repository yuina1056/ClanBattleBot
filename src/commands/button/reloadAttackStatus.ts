/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";

import ManagementMessage from "@/messages/ManagementChannelMessage";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { EventBossRepository } from "@/repository/eventBossRepository";
import { UserRepository } from "@/repository/userRepository";

export class ReloadAttackStatus extends Button {
  static readonly customId = "reload_attack_status";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(ReloadAttackStatus.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("凸状況更新");
  }
  async execute(interaction: ButtonInteraction) {
    const guild = interaction.guild;
    if (guild == null) {
      throw new Error("guild is null");
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
      throw new Error("開催情報が取得できませんでした");
    }
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    const users = await new UserRepository().getUsersByClanIdToRelationReports(clan.id!);
    const eventBoss = await new EventBossRepository().getEventBossByClanIdAndEventId(
      clan.id!,
      event.id!,
    );
    if (eventBoss == null) {
      throw new Error("ボスHP情報が取得できませんでした");
    }
    await interaction.deferUpdate();
    await ManagementMessage.sendMessage(
      interaction.channel,
      interaction.message,
      clan,
      users,
      event,
      eventBoss,
      false,
    );
  }
}
