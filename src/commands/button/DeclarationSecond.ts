import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';

import Declaration from '../../model/Declaration';
import DataSource from '../../datasource';
import Boss from '../../entity/Boss';

export const customId = 'declaration_second'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("2凸目")

export async function execute(interaction: ButtonInteraction) {
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel?.id! })
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした')
  }
  let content: string = ''
  const user = await Declaration.regist(boss, interaction.user.id, 2)
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
