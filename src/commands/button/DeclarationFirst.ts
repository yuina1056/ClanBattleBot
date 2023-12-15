import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationFirst extends DeclarationAbstract {
  static readonly customId: string = "declarationFirst";
  attackCount: number;
  isAttackCarryOver: boolean;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = false;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationFirst.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目");
  }
}
