import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../model/Declaration';

export const customId = 'declaration_first'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("1凸目")

export async function execute(interaction: ButtonInteraction) {
  await interaction.deferReply({
    ephemeral: true
  });
  const user = await Declaration.regist(interaction.channel?.id!,interaction.user.id, 1)

  await interaction.followUp({ content: user!.name + 'が凸宣言しました' });
}

export default {
  customId,
  data,
  execute
};
