import { ChannelType, SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('botを使い始める準備をします');

export async function execute(interaction: CommandInteraction) {
  const guild = interaction.guild
  // カテゴリ作成
  await guild?.channels.create({ name: 'クランバトル管理', type: ChannelType.GuildCategory })
  const categoryId = guild?.channels.cache.find((channel) => channel.name === 'クランバトル管理')?.id

  // 作成したカテゴリ内にチャンネル作成
  await guild?.channels.create({ name: '凸管理', parent: categoryId })
  await interaction.guild?.channels.create({ name: '1ボス', parent: categoryId })
  await interaction.guild?.channels.create({ name: '2ボス', parent: categoryId })
  await interaction.guild?.channels.create({ name: '3ボス', parent: categoryId })
  await interaction.guild?.channels.create({ name: '4ボス', parent: categoryId })
  await interaction.guild?.channels.create({ name: '5ボス', parent: categoryId })


  await interaction.reply('チャンネルを作成しました');
}

export default {
  data,
  execute
};
