import { DeclarationAbstract } from "@/commands/button/DeclarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationFirstAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationFirstAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 1;
    this.isAttackCarryOver = true;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationFirstAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("1凸目持越");
  }
}
