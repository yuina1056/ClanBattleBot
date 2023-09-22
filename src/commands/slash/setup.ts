/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ChannelType,
  SlashCommandBuilder,
  Guild,
  CommandInteraction,
} from "discord.js";

import DataSource from "../../datasource";
import Clan from "../../entity/Clan";
import User from "../../entity/User";
import Boss from "../../entity/Boss";
import management_message from "../../messages/ManagementChannelMessage";
import BossChannelMessage from "../../messages/BossChannelMessage";
import Declaration from "../../entity/Declaration";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("botを使い始める準備をします")
  .addRoleOption((option) =>
    option
      .setName("ロール")
      .setDescription("作成するクランのロールを入力")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  let roleName: string;
  let roleId: string;
  if (interaction.options.data[0].role != null) {
    roleName = interaction.options.data[0].role.name;
    roleId = interaction.options.data[0].role.id;
  } else {
    throw new Error("role is null");
  }

  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
  }

  const categoryName = "クランバトル管理(" + roleName + ")";
  if (
    guild.channels.cache.find((channel) => channel.name === categoryName) !=
    null
  ) {
    throw new Error("既にチャンネルのセットアップが完了しています");
  }

  // カテゴリ作成
  await guild.channels.create({
    name: categoryName,
    type: ChannelType.GuildCategory,
  });
  const categoryId =
    guild.channels.cache.find((channel) => channel.name === categoryName)?.id ??
    "";

  // DBにクラン情報保存
  const clan = new Clan(roleName, roleId, categoryId);
  const clanRepository = DataSource.getRepository(Clan);
  const saveClan = await clanRepository.save(clan);
  if (saveClan == null) {
    throw new Error("クランの初期設定が完了しませんでした");
  }

  // Roleからユーザーを取得してDBに保存
  await interaction.guild.members.fetch();
  const role = await guild.roles.fetch(roleId);
  const guildMembers = await role?.members;
  if (guildMembers != null) {
    guildMembers.forEach(async (guildMember) => {
      console.log(guildMember);
      let userName = "";
      // 名前の取得優先度： サーバーニックネーム > discordネーム > ユーザーID
      if (guildMember.nickname != null) {
        userName = guildMember.nickname;
      } else if (guildMember.user.globalName != null) {
        userName = guildMember.user.globalName;
      } else {
        userName = guildMember.user.username;
      }
      const user = new User(saveClan.id!, userName, guildMember.user.id);
      const userRepository = DataSource.getRepository(User);
      await userRepository.save(user);
    });
  }

  // 作成したカテゴリ内にチャンネル作成
  await createManagementChannel(guild, "凸状況", clan);
  await createBossChannel(guild, roleName, 1, "1ボス", clan);
  await createBossChannel(guild, roleName, 2, "2ボス", clan);
  await createBossChannel(guild, roleName, 3, "3ボス", clan);
  await createBossChannel(guild, roleName, 4, "4ボス", clan);
  await createBossChannel(guild, roleName, 5, "5ボス", clan);

  await interaction.followUp({
    content: "チャンネルを作成しました",
    ephemeral: true,
  });
}

export default {
  data,
  execute,
};

// 凸管理用チャンネル作成
async function createManagementChannel(
  guild: Guild,
  channelName: string,
  clan: Clan
) {
  await guild.channels.create({
    name: channelName,
    parent: clan.discordCategoryId,
  });

  const channel = guild.channels.cache.find(
    (channel) =>
      channel.name === channelName &&
      channel.parentId === clan.discordCategoryId
  );
  if (channel == null) {
    throw new Error("channel is null");
  }
  const users = await DataSource.getRepository(User).findBy({
    clanId: clan.id,
  });

  if (channel.isTextBased()) {
    await management_message.sendMessage(channel, null, users, null, true);
  }
}

// 各ボス用チャンネル作成
async function createBossChannel(
  guild: Guild,
  roleName: string,
  bossId: number,
  channelName: string,
  clan: Clan
) {
  await guild.channels.create({
    name: channelName,
    parent: clan.discordCategoryId,
  });

  const channel = guild.channels.cache.get(
    guild.channels.cache.find(
      (channel) =>
        channel.name === channelName &&
        channel.parentId === clan.discordCategoryId
    )?.id ?? ""
  );
  if (channel == null) {
    throw new Error("channel is null");
  }
  const boss = new Boss(clan.id!, bossId, channel.id);
  const bossRepository = DataSource.getRepository(Boss);
  await bossRepository.save(boss);

  const declaration: Declaration[] = [];
  if (channel?.isTextBased()) {
    await BossChannelMessage.sendMessage(channel, clan, boss, declaration);
  }
}
