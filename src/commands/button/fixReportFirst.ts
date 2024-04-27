import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportFirst extends FixReportAbstract {
  static readonly customId: string = "fixReportFirst";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportFirst.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目");
  }
}
