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
    return
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel!.id })
  if (boss == null) {
    return
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({ discordUserId: interaction.user.id })
  if (user == null) {
    return
  }

  // DBから削除
  const declarationRepository = DataSource.getRepository(Declaration)
  const declaration = await declarationRepository.findOneBy({ userId: user.id, isFinished: false })
  if (declaration == null) {
    return
  }
  await declarationRepository.delete(declaration.id!)

  await interaction.reply({ content: user.name + 'が凸宣言取消しました' });
}

export default {
  customId,
  data,
  execute
};
