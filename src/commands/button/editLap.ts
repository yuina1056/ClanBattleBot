import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";

import { ModalEditLap } from "@/commands/modal/editLap";
import Lap from "@/entity/Lap";
import DataSource from "@/datasource";
import Clan from "@/entity/Clan";
import Event from "@/entity/Event";
import dayjs from "dayjs";
import { Button } from "@/commands/button/button";

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
    const today = dayjs().format();
    const event = await DataSource.getRepository(Event)
      .createQueryBuilder("event")
      .where("event.fromDate <= :today", { today })
      .andWhere("event.toDate >= :today", { today })
      .getOne();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    // クラン取得
    const clan = await DataSource.getRepository(Clan).findOneBy({
      discordCategoryId: channel.parentId,
    });
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    const lapRepository = DataSource.getRepository(Lap);
    const lap = await lapRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
    if (lap == null) {
      throw new Error("周回数情報が取得できませんでした");
    }
    const modal = new ModalEditLap().createModal(lap);
    await interaction.showModal(modal);
  }
}
