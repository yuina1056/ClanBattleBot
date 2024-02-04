/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import { ModalEditLap } from "@/commands/modal/editLap";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";

export class EditLap extends Button {
  static readonly customId = "edit_lap";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(EditLap.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("周回数修正");
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
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      event.id!,
      clan.id!,
    );
    if (clanEvent == null) {
      throw new Error("クラン毎イベント情報が取得できませんでした");
    }
    const modal = new ModalEditLap().createModal(clanEvent);
    await interaction.showModal(modal);
  }
}
