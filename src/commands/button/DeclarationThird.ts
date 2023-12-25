import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationThird extends DeclarationAbstract {
  static readonly customId: string = "declarationThird";
  attackCount: number;
  isAttackCarryOver: boolean;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.isAttackCarryOver = false;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationThird.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("3凸目");
  }
}
