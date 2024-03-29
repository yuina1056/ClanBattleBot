import { ButtonBuilder, ButtonStyle } from "discord.js";

import { ResetDeclarationReportAbstract } from "@/commands/button/resetDeclarationReportAbstract";

export class ResetDeclarationReportSecond extends ResetDeclarationReportAbstract {
  static readonly customId: string = "reset_declaration_report_second";
  attackCount: number;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 2;
    this.button = new ButtonBuilder()
      .setCustomId(ResetDeclarationReportSecond.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("2凸目リセット");
  }
}
