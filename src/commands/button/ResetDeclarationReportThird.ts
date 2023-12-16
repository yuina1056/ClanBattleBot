import { ButtonBuilder, ButtonStyle } from "discord.js";

import { ResetDeclarationReportAbstract } from "@/commands/button/ResetDeclarationReportAbstract";

export class ResetDeclarationReportThird extends ResetDeclarationReportAbstract {
  static readonly customId: string = "reset_declaration_report_third";
  attackCount: number;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.data = new ButtonBuilder()
      .setCustomId(ResetDeclarationReportThird.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目リセット");
  }
}
