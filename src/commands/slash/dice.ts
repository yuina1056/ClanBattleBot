import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Slash } from "@/commands/slash/slash";

export class Dice extends Slash {
  static readonly commandName: string = "dice";
  slashCommand: SlashCommandBuilder;

  constructor() {
    super();
    this.slashCommand = new SlashCommandBuilder()
      .setName(Dice.commandName)
      .setDescription("運命のダイスロール");
  }

  async execute(interaction: CommandInteraction) {
    const result = Math.floor(Math.random() * (6 + 1 - 1)) + 1;
    const res = result.toString();
    await interaction.reply("サイコロの出目：" + res);
  }
}
