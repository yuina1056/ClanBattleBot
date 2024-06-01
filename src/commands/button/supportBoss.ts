import { Button } from "@/commands/button/button";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Relief } from "@/commands/button/relief";

export class SupportBoss extends Button {
  static readonly customId = "support_boss";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(SupportBoss.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("補助");
  }
  async execute(interaction: ButtonInteraction) {
    const relief = new Relief();
    await interaction.reply({
      ephemeral: true,
      content: "サポートメニュー",
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(relief.button)],
    });
  }
}
