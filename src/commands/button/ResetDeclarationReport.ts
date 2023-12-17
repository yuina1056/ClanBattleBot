import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from "discord.js";
import { ResetDeclarationReportFirst } from "@/commands/button/ResetDeclarationReportFirst";
import { ResetDeclarationReportSecond } from "@/commands/button/ResetDeclarationReportSecond";
import { ResetDeclarationReportThird } from "@/commands/button/ResetDeclarationReportThird";
import { Button } from "@/commands/button/button";

export class ResetDeclarationReport extends Button {
  static readonly customId = "reset_declaration_report";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(ResetDeclarationReport.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("凸状況リセット");
  }

  async execute(interaction: ButtonInteraction) {
    const resetDeclarationReportFirst = new ResetDeclarationReportFirst();
    const resetDeclarationReportSecond = new ResetDeclarationReportSecond();
    const resetDeclarationReportThird = new ResetDeclarationReportThird();

    await interaction.reply({
      ephemeral: true,
      content: "どの凸をリセットしますか？(ボタンを押したらリセット処理が行われます)",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          resetDeclarationReportFirst.button,
          resetDeclarationReportSecond.button,
          resetDeclarationReportThird.button,
        ),
      ],
    });
  }
}
