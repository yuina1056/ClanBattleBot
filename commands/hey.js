// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js');

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
  data: new SlashCommandBuilder()
    .setName('hey')
    .setDescription('あいさつに反応してbotが返事します'),
  execute: async function (interaction) {
    await interaction.reply('Fuck.');
  },
};
