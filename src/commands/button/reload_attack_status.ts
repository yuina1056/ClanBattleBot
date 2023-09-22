import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import dayjs from 'dayjs';

import ManagementMessage from '../../messages/ManagementChannelMessage';
import DataSource from '../../database/dataSource';
import User from '../../entity/User';
import Clan from '../../entity/Clan';
import Event from '../../entity/Event';

export const customId = 'reload_attack_status';
export const data = new ButtonBuilder()
  .setCustomId('reload_attack_status')
  .setStyle(ButtonStyle.Secondary)
  .setLabel('凸状況更新');

export async function execute(interaction: ButtonInteraction) {
  await interaction.deferUpdate();
  const guild = interaction.guild;
  if (guild == null) {
    throw new Error('guild is null');
  }
  if (interaction.channel == null) {
    throw new Error('interaction.channel is null');
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
  if (channel == null) {
    throw new Error('channel is null');
  }
  if (channel.parentId == null) {
    throw new Error('channel.parentId is null');
  }
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel.parentId,
  });
  if (clan == null) {
    throw new Error('クラン情報が取得できませんでした');
  }
  const users = await DataSource.getRepository(User).find({
    where: { clanId: clan.id },
    relations: {
      reports: {
        event: true,
      },
    },
  });
  await ManagementMessage.sendMessage(
    interaction.channel,
    interaction.message,
    users,
    event,
    false
  );
}

export default {
  customId,
  data,
  execute,
};
