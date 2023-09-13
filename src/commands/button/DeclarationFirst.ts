import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../model/Declaration';

export const customId = 'declaration_first'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("1凸目")

export async function execute(interaction: ButtonInteraction) {
  let content: string = ''
  try {
    const user = await Declaration.regist(interaction.channel?.id!, interaction.user.id, 1)
    content = user!.name + 'が凸宣言しました'
  } catch (error) {
    if (error instanceof Error) {
      content = error.message
    } else if (typeof error === 'string') {
      console.log(error)
    } else {
      console.log("unexpected error")
    }
    throw error
  } finally {
    await interaction.reply({ content: content });
  }

}

export default {
  customId,
  data,
  execute
};
