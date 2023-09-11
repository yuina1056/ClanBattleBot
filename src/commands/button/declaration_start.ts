import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';
import dayjs from 'dayjs';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Boss from '../../entity/Boss';
import Declaration from '../../entity/Declaration';
import Event from '../../entity/Event';

export const customId = 'declaration_start'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("凸宣言")


export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    return
  }
  const today = dayjs().format()
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
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
  const declaration = new Declaration(user.clanId, user.id!,event!.id!, boss.bossid, 0, event.getClanBattleDay(), 1, false)
  const declarationRepository = DataSource.getRepository(Declaration)
  await declarationRepository.save(declaration)

  await interaction.reply({ content: user.name + 'が凸宣言しました' });
}

export default {
  customId,
  data,
  execute
};
