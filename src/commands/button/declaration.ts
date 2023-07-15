import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild, ActionRowBuilder } from 'discord.js';
export const customId = 'declaration'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("凸宣言")

import button_declaration from '../button/declaration';
import button_remainingHP from '../button/remaining_hp';

export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    return
  }
  const user = guild.members.cache.get(interaction.user.id)

  await interaction.channel?.send({ content: user?.nickname + 'が凸宣言しました' });

  

  await interaction.reply({
    content: '結果を選択してください',
    components: [
      new ActionRowBuilder().addComponents(button_declaration.data, button_remainingHP.data).toJSON() as any,
    ],
    ephemeral: true
  });

}

export default {
  customId,
  data,
  execute
};
