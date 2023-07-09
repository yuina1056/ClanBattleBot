import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
export const customId = 'remainingHP'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Danger)
  .setLabel("残HP")

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({ content: '残HPが表示されました', ephemeral: true });
}

export default {
  customId,
  data,
  execute
};
