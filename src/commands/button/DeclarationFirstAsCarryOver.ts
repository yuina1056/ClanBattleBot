import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationFirstAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationFirstAsCarryOver";
  attackCount: number;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationFirstAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("1凸目持越");
  }
}
