import { DeclarationAbstract } from "@/commands/button/declarationAbstract";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class DeclarationThirdAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationThirdAsCarryOver";
  attackCount: number;
  isAttackCarryOver: boolean;
  button: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.isAttackCarryOver = true;
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationThirdAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("3凸目持越");
  }
}
