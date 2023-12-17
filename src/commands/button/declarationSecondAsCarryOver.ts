import { DeclarationAbstract } from "@/commands/button/declarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationSecondAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationSecondAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 2;
    this.isAttackCarryOver = true;
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationSecondAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("2凸目持越");
  }
}
