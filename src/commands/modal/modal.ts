import { ModalSubmitInteraction } from "discord.js";

export abstract class Modal {
  static readonly customId: string;

  abstract submit(interaction: ModalSubmitInteraction): Promise<void>;
}
