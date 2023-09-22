/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';
import dayjs from 'dayjs';

import DataSource from '../../database/dataSource';
import User from '../../entity/user';
import Report from '../../entity/report';
import Boss from '../../entity/boss';
import Clan from '../../entity/clan';
import Event from '../../entity/event';
import Declaration from '../../entity/declaration';
import BossChannelMessage from '../../messages/bossChannelMessage';

export const customId = 'report_defeat';
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel('撃破');

export async function execute(interaction: ButtonInteraction) {
  let content = '';
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error('interaction.guild is null');
  }
  if (interaction.channel == null) {
    throw new Error('interaction.channel is null');
  }
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  if (event == null) {
    throw new Error('クランバトル開催情報が取得できませんでした');
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
  if (channel == null) {
    throw new Error('channel is null');
  }
  if (channel.parentId == null) {
    throw new Error('channel.parentId is null');
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
    discordChannelId: interaction.channel?.id,
  });
  if (boss == null) {
    throw new Error('ボス情報が取得できませんでした');
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan.id,
  });
  if (user == null) {
    throw new Error('ユーザー情報が取得できませんでした');
  }
  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findOneBy({
    isFinished: false,
  });
  if (declaration == null) {
    content = '凸宣言がされていません';
    await interaction.reply({ content: content });
    return;
  }
  if (declaration.id == null) {
    throw new Error('declaration.id is null');
  }
  await declarationRepository.update(declaration.id, { isFinished: true });

  // 持ち越しが発生しているかチェック
  let isCarryOver = false;
  const reports = await DataSource.getRepository(Report).find({
    where: {
      eventId: event.id,
      day: declaration.day,
      attackCount: declaration.attackCount,
    },
  });
  if (reports.length === 0) {
    isCarryOver = true;
  }

  // DBに保存
  const report = new Report(
    user.clanId,
    user.id!,
    event.id!,
    boss.bossid,
    0,
    event.getClanBattleDay(),
    declaration.attackCount,
    0,
    true,
    isCarryOver
  );
  await DataSource.getRepository(Report).save(report);
  content = user.name + 'が' + boss.bossid + 'ボスを撃破しました';

  const declarations = await DataSource.getRepository(Declaration).find({
    where: {
      bossId: boss.id,
      isFinished: false,
    },
    relations: {
      user: true,
    },
  });
  await BossChannelMessage.sendMessage(interaction.channel, clan, boss, declarations);
  await interaction.reply({ content: content });
}

export default {
  customId,
  data,
  execute,
};
