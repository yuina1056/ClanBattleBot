import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationSecondAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationSecondAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = true;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationSecondAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("2凸目持越");
  }
}
