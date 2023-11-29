import { DeclarationAbstract } from '@/commands/button/DeclarationAbstract'
import { ButtonBuilder, ButtonStyle } from 'discord.js';

export class DeclarationThirdAsCarryOver extends DeclarationAbstract {
  static readonly customId: string = "declarationThirdAsCarryOver";
  attackCount: number;
  data: ButtonBuilder;

  constructor() {
    super();
    this.attackCount = 3;
    this.data = new ButtonBuilder()
      .setCustomId(DeclarationThirdAsCarryOver.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("3凸目持越");
  }
}
