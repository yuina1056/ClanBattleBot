import { DeclarationAbstract } from "@/commands/button/declarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationSecond extends DeclarationAbstract {
  static readonly customId: string = "declarationSecond";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 2;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationSecond.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("2凸目");
  }
}
