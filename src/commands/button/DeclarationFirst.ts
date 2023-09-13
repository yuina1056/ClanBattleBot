import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../app/model/Declaration';
import DataSource from '../../datasource';
import Boss from '../../entity/Boss';
import Clan from '../../entity/Clan';
import DeclarationRepository from '../../entity/Declaration';

import BossChannelMessage from '../../messages/BossChannelMessage';

export const customId = 'declaration_first'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("1凸目")

export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    throw new Error('interaction.guild is null')
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss)
  const boss = await bossRepository.findOneBy({ discordChannelId: interaction.channel?.id! })
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした')
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id)
  const clan = await DataSource.getRepository(Clan).findOneBy({ discordCategoryId: channel!.parentId! })
  if (clan == null) {
    throw new Error('クラン情報が取得できませんでした')
  }

  let content: string = ''
  const user = await Declaration.regist(boss, interaction.user.id, 1)
  if (user instanceof Error) {
    content = user.message
  } else {
    content = user!.name + 'が'+ boss.bossid +'ボスに凸宣言しました'
  }

  const declarations = await DataSource.getRepository(DeclarationRepository).find(
    {
      where: {
        bossId: boss.id,
        isFinished: false
      },
      relations: {
        user: true
      }
    })
  await BossChannelMessage.sendMessage(interaction.channel!, clan, boss,declarations,false)
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute
};
