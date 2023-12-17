import { ButtonBuilder, ButtonStyle } from "discord.js";

import { ResetDeclarationReportAbstract } from "@/commands/button/Reset_DeclarationReportAbstract";

export class ResetDeclarationReportThird extends ResetDeclarationReportAbstract {
  static readonly customId: string = "reset_declaration_report_third";
  attackCount: number;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.button = new ButtonBuilder()
      .setCustomId(ResetDeclarationReportThird.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目リセット");
  }
}
