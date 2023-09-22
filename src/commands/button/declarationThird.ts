import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';

import Declaration from '../../app/model/Declaration';
import DataSource from '../../database/dataSource';
import Boss from '../../entity/boss';
import Clan from '../../entity/clan';
import DeclarationRepository from '../../entity/declaration';
import BossChannelMessage from '../../messages/bossChannelMessage';

export const customId = 'declaration_third';
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel('3凸目');

export async function execute(interaction: ButtonInteraction) {
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error('interaction.guild is null');
  }
  if (interaction.channel == null) {
    throw new Error('interaction.channel is null');
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
  if (channel == null) {
    throw new Error('チャンネル情報が取得できませんでした');
  }
  if (channel.parentId == null) {
    throw new Error('親カテゴリ情報が取得できませんでした');
  }
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error('クラン情報が取得できませんでした');
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    clanId: clan.id,
    discordChannelId: interaction.channel.id,
  });
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした');
  }

  let content = '';
  const user = await Declaration.regist(boss, interaction.user.id, 3);
  if (user instanceof Error) {
    content = user.message;
  } else {
    content = user?.name + 'が' + boss.bossid + 'ボスに凸宣言しました';
  }

  const declarations = await DataSource.getRepository(DeclarationRepository).find({
    where: {
      bossId: boss.id,
      isFinished: false,
    },
    relations: {
      user: true,
    },
  });
  await BossChannelMessage.sendMessage(interaction.channel, clan, boss, declarations);
  const deleteMessage = await channel.messages.fetch(
    interaction.message.reference?.messageId ?? ''
  );
  await deleteMessage.delete();
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute,
};
