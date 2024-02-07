import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Button } from "@/commands/button/button";

export class FixReport extends Button {
  static readonly customId = "fix_report";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(FixReport.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("凸報告修正");
  }
  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({ content: "報告を修正します", ephemeral: true });
  }
}
