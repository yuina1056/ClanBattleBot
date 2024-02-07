import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportSecond extends FixReportAbstract {
  static readonly customId: string = "fixReportSecond";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 2;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportSecond.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("2凸目");
  }
}
