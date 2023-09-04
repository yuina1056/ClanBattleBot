import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
export const customId = 'reload_attack_status'
export const data = new ButtonBuilder()
  .setCustomId('reload_attack_status')
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況更新")

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({ content: '凸状況更新ボタンが押されました', ephemeral: true });
}

export default {
  customId,
  data,
  execute
}
