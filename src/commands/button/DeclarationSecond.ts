import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationSecond extends DeclarationAbstract {
  static readonly customId: string = "declarationSecond";
  attackCount: number;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 2;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationSecond.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("2凸目");
  }
}
