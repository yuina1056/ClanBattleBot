import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Report from '../../entity/Report';
import Boss from '../../entity/Boss';

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

  // DBに保存
  const report = new Report(user.clanId, user.id!, boss.bossid, 0, 0, true)
  const reportRepository = DataSource.getRepository(Report)
  await reportRepository.save(report)

  await interaction.reply({ content: user.name + 'が撃破しました' });
}

export default {
  customId,
  data,
  execute
};
