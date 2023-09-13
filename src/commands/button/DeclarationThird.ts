import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';

import Declaration from '../../model/Declaration';

export const customId = 'declaration_third'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("3凸目")

export async function execute(interaction: ButtonInteraction) {
  await interaction.deferReply({
    ephemeral: true
  });
  const user = await Declaration.regist(interaction.channel?.id!, interaction.user.id, 3)

  await interaction.followUp({ content: user!.name + 'が凸宣言しました' });
}

export default {
  customId,
  data,
  execute
};
