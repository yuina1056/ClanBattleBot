import { ButtonBuilder, ButtonStyle } from "discord.js";

import { ResetDeclarationReportAbstract } from "@/commands/button/resetDeclarationReportAbstract";

export class ResetDeclarationReportFirst extends ResetDeclarationReportAbstract {
  static readonly customId: string = "reset_declaration_report_first";
  attackCount: number;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.button = new ButtonBuilder()
      .setCustomId(ResetDeclarationReportFirst.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目リセット");
  }
}
