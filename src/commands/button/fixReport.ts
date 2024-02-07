import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Button } from "@/commands/button/button";
import { FixReportFirst } from "./fixReportFirst";
import { FixReportFirstAsCarryOver } from "./fixReportFirstAsCarryOver";
import { FixReportSecond } from "./fixReportSecond";
import { FixReportSecondAsCarryOver } from "./fixReportSecondAsCarryOver";
import { FixReportThird } from "./fixReportThird";
import { FixReportThirdAsCarryOver } from "./fixReportThirdAsCarryOver";

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
    await interaction.reply({
      content: "どの凸報告を修正しますか？",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new FixReportFirst().button,
          new FixReportFirstAsCarryOver().button,
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new FixReportSecond().button,
          new FixReportSecondAsCarryOver().button,
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new FixReportThird().button,
          new FixReportThirdAsCarryOver().button,
        ),
      ],
      ephemeral: true,
    });
  }
}
