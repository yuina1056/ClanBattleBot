import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import DataSource from "@/repository/repository";
import { ModalEditHp } from "@/commands/modal/editHp";
import EventBoss from "@/entity/EventBoss";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";

export class EditHp extends Button {
  static readonly customId = "edit_hp";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(EditHp.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("ボスHP修正");
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
    const eventBossRepository = DataSource.getRepository(EventBoss);
    const eventBoss = await eventBossRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
    if (eventBoss == null) {
      throw new Error("クランバトルボスのHP情報が取得できませんでした");
    }
    const modal = new ModalEditHp().createModal(eventBoss);
    await interaction.showModal(modal);
  }
}
