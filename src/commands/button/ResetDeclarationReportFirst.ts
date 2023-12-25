import { ButtonBuilder, ButtonStyle } from "discord.js";

import { ResetDeclarationReportAbstract } from "@/commands/button/ResetDeclarationReportAbstract";

export class ResetDeclarationReportFirst extends ResetDeclarationReportAbstract {
  static readonly customId: string = "reset_declaration_report_first";
  attackCount: number;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.data = new ButtonBuilder()
      .setCustomId(ResetDeclarationReportFirst.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目リセット");
  }
}
