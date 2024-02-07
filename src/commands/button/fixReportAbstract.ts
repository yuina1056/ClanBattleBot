import { Button } from "@/commands/button/button";
import { ButtonInteraction } from "discord.js";

export abstract class FixReportAbstract extends Button {
  abstract attackCount: number;
  abstract isAttackCarryOver: boolean;
  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({ content: "報告を修正します", ephemeral: true });
  }
}
