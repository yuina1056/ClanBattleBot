import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../model/Declaration';

export const customId = 'declaration_first'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("1凸目")

export async function execute(interaction: ButtonInteraction) {
  let content: string = ''
  const user = await Declaration.regist(interaction.channel?.id!, interaction.user.id, 1)
  if (user instanceof Error) {
    content = user.message
  } else {
    content = user!.name + 'が凸宣言しました'
  }
    await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute
};
