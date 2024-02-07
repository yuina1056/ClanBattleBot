import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportFirstAsCarryOver extends FixReportAbstract {
  static readonly customId: string = "fixReportFirstAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = true;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportFirstAsCarryOver.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目持越");
  }
}
