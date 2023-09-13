import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';

import Declaration from '../../model/Declaration';

export const customId = 'declaration_second'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("2凸目")

export async function execute(interaction: ButtonInteraction) {
  await interaction.deferReply({
    ephemeral: true
  });
  const user = await Declaration.regist(interaction.channel?.id!, interaction.user.id, 2)

  await interaction.followUp({ content: user!.name + 'が凸宣言しました' });
}

export default {
  customId,
  data,
  execute
};
