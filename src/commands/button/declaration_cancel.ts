import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Boss from '../../entity/Boss';
import Declaration from '../../entity/Declaration';

export const customId = 'declaration_cancel'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Danger)
  .setLabel("取消")


export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    throw new Error('interaction.guild is null')
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel!.id })
  if (boss == null) {
    throw new Error('boss is null')
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({ discordUserId: interaction.user.id })
  if (user == null) {
    throw new Error('user is null')
  }

  // DBから削除
  const declarationRepository = DataSource.getRepository(Declaration)
  const declaration = await declarationRepository.findOneBy({ userId: user.id, isFinished: false })
  if (declaration == null) {
    throw new Error('declaration is null')
  }
  await declarationRepository.delete(declaration.id!)

  await interaction.reply({ content: user.name + 'が凸宣言取消しました' });
}

export default {
  customId,
  data,
  execute
};
