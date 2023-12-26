import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import dayjs from "dayjs";

import ManagementMessage from "@/messages/ManagementChannelMessage";
import DataSource from "@/datasource";
import User from "@/entity/User";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";
import EventBoss from "@/entity/EventBoss";
import { Button } from "@/commands/button/button";

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
    const today = dayjs().format();
    const event = await DataSource.getRepository(Event)
      .createQueryBuilder("event")
      .where("event.fromDate <= :today", { today })
      .andWhere("event.toDate >= :today", { today })
      .getOne();
    if (event == null) {
      throw new Error("開催情報が取得できませんでした");
    }
    const clan = await DataSource.getRepository(Clan).findOneBy({
      discordCategoryId: channel.parentId,
    });
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    const users = await DataSource.getRepository(User).find({
      where: { clanId: clan.id },
      relations: {
        reports: {
          event: true,
        },
      },
    });
    const eventBossRepository = DataSource.getRepository(EventBoss);
    const eventBoss = await eventBossRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
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