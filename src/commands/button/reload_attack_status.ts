import { ButtonBuilder, ButtonStyle, ButtonInteraction, TextBasedChannel, EmbedBuilder, ActionRowBuilder } from 'discord.js';

import ManagementMessage from '../../messages/ManagementChannelMessage';

export const customId = 'reload_attack_status'
export const data = new ButtonBuilder()
  .setCustomId('reload_attack_status')
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況更新")

export async function execute(interaction: ButtonInteraction) {
  await interaction.message.delete()
  await ManagementMessage.sendMessage(interaction.channel!, false)
}

export default {
  customId,
  data,
  execute,
}
