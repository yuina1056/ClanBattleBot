import { FixReportAbstract } from "@/commands/button/fixReportAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class FixReportSecondAsCarryOver extends FixReportAbstract {
  static readonly customId: string = "fixReportSecondAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;
  constructor() {
    super();
    this.attackCount = 2;
    this.isAttackCarryOver = true;
    this.button = new ButtonBuilder()
      .setCustomId(FixReportSecondAsCarryOver.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("2凸目持越");
  }
}
