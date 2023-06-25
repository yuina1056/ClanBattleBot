// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('hey')
  .setDescription('あいさつに反応してbotが返事します');

export async function execute(interaction: any) {
  await interaction.reply('Fuck.');
}

export default {
  data,
  execute
};
