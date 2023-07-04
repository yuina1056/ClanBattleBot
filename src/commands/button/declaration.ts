import { ButtonInteraction } from 'discord.js';

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({ content: '凸宣言されました', ephemeral: true });
}

export default {
  execute
};
