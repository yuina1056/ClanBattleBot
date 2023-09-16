import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dice")
  .setDescription("運命のダイスロール");

export async function execute(interaction: CommandInteraction) {
  const result = Math.floor(Math.random() * (6 + 1 - 1)) + 1;
  const res = result.toString();
  await interaction.reply("サイコロの出目：" + res);
}

export default {
  data,
  execute,
};
