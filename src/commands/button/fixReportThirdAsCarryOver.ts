import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportThirdAsCarryOver extends FixReportAbstract {
  static readonly customId: string = "fixReportThirdAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 3;
    this.isAttackCarryOver = true;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportThirdAsCarryOver.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目持越");
  }
}
