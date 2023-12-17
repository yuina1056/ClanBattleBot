import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export abstract class Slash {
  static readonly commandName: string;
  abstract slashCommand: SlashCommandBuilder;

  abstract execute(interaction: CommandInteraction): Promise<void>;
}
