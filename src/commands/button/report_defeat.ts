import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import DataSource from '../../datasource';
import User from '../../entity/User';

export const customId = 'report_defeat'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("撃破")


export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    return
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({ discordUserId: interaction.user.id })
  if (user == null) {
    return
  }
  console.log(user)
  // DBに保存


  await interaction.reply({ content: user.name + 'が撃破しました' });
}

export default {
  customId,
  data,
  execute
};
