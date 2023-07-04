import { ButtonInteraction } from 'discord.js';

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({ content: '残HPが表示されました', ephemeral: true });
}

export default {
  execute
};
