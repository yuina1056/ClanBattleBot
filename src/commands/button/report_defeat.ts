import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';
import dayjs from 'dayjs';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Report from '../../entity/Report';
import Boss from '../../entity/Boss';
import Clan from '../../entity/Clan';
import Event from '../../entity/Event';
import Declaration from '../../entity/Declaration';
import BossChannelMessage from '../../messages/BossChannelMessage';

export const customId = 'report_defeat'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("撃破")


export async function execute(interaction: ButtonInteraction) {
  let content: string = ''
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    throw new Error('interaction.guild is null')
  }
  const today = dayjs().format()
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
    throw new Error('event is null')
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id)
  const clan = await DataSource.getRepository(Clan).findOneBy({ discordCategoryId: channel!.parentId! })
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel!.id })
  if (boss == null) {
    throw new Error('boss is null')
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User)
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan?.id!
  })
  if (user == null) {
    throw new Error('user is null')
  }
  const declarationRepository = DataSource.getRepository(Declaration)
  const declaration = await declarationRepository.findOneBy({ isFinished: false })
  if (declaration == null) {
    content = '凸宣言がされていません'
    await interaction.reply({ content: content });
    return
  }
  await declarationRepository.update(declaration!.id!, { isFinished: true })

  // DBに保存
  const report = new Report(user.clanId, user.id!, event!.id!, boss.bossid, 0, event.getClanBattleDay(), 1, 0, true)
  await DataSource.getRepository(Report).save(report).catch((err) => {
    console.log(err)
  })
  content = user.name + 'が撃破しました'

  const declarations = await DataSource.getRepository(Declaration).find(
    {
      where: {
        bossId: boss.id,
        isFinished: false
      },
      relations: {
        user: true
      }
    })
  await BossChannelMessage.sendMessage(interaction.channel!, clan!, boss, declarations,false)
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute
};
