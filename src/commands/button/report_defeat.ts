import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';
import dayjs from 'dayjs';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Report from '../../entity/Report';
import Boss from '../../entity/Boss';
import Clan from '../../entity/Clan';
import Event from '../../entity/Event';

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
  const today = dayjs().format()
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
    console.log('イベントが見つかりませんでした')
    return
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id)
  const clan = await DataSource.getRepository(Clan).findOneBy({ discordCategoryId: channel!.parentId! })
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel!.id })
  if (boss == null) {
    console.log('ボスが見つかりませんでした')
    return
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan?.id!
  })
  if (user == null) {
    console.log('ユーザーが見つかりませんでした')
    return
  }

  // DBに保存
  const report = new Report(user.clanId, user.id!, event!.id!, boss.bossid, 0, 1, 1, 0, true)
  await DataSource.getRepository(Report).save(report).catch((err) => {
    console.log(err)
  })

  await interaction.reply({ content: user.name + 'が撃破しました' });
}

export default {
  customId,
  data,
  execute
};
