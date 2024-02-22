import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export abstract class Slash {
  static readonly commandName: string;
  abstract slashCommand:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  abstract execute(interaction: CommandInteraction): Promise<void>;
}
