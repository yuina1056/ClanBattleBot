import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
export const customId = 'management_setting'
export const data = new ButtonBuilder()
  .setCustomId('management_setting')
  .setStyle(ButtonStyle.Primary)
  .setLabel("設定")

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({ content: '凸管理の設定ボタンが押されました', ephemeral: true });
}

export default {
  customId,
  data,
  execute
}
