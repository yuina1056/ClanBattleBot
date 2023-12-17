import { DeclarationAbstract } from "@/commands/button/declarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationThird extends DeclarationAbstract {
  static readonly customId: string = "declarationThird";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationThird.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目");
  }
}
