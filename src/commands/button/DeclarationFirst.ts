import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../model/Declaration';
import DataSource from '../../datasource';
import Boss from '../../entity/Boss';

export const customId = 'declaration_first'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("1凸目")

export async function execute(interaction: ButtonInteraction) {
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel?.id! })
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした')
  }
  let content: string = ''
  const user = await Declaration.regist(boss, interaction.user.id, 1)
  if (user instanceof Error) {
    content = user.message
  } else {
    content = user!.name + 'が'+ boss.bossid +'ボスに凸宣言しました'
  }
    await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute
};
