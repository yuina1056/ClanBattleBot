import { DeclarationAbstract } from "@/commands/button/declarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationFirst extends DeclarationAbstract {
  static readonly customId: string = "declarationFirst";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = false;
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationFirst.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("1凸目");
  }
}
