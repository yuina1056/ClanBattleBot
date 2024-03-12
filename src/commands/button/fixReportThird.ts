import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportThird extends FixReportAbstract {
  static readonly customId: string = "fixReportThird";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 3;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportThird.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目");
  }
}
