import { ButtonBuilder, ButtonInteraction } from "discord.js";

export abstract class Button {
  static readonly customId: string;
  abstract data: ButtonBuilder;

  abstract execute(interaction: ButtonInteraction): Promise<void>;
}
