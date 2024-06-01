import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from "discord.js";
import { Button } from "@/commands/button/button";
import { ClanRepository } from "@/repository/clanRepository";
import { BossRepository } from "@/repository/bossRepository";
import { EventRepository } from "@/repository/eventRepository";
import { UserRepository } from "@/repository/userRepository";

export class Relief extends Button {
  static readonly customId = "relief";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(Relief.customId)
      .setStyle(ButtonStyle.Danger)
      .setLabel("救援依頼");
  }
  async execute(interaction: ButtonInteraction) {
    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    if (interaction.channel == null) {
      throw new Error("interaction.channel is null");
    }
    const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
    if (channel == null) {
      throw new Error("チャンネル情報が取得できませんでした");
    }
    if (channel.parentId == null) {
      throw new Error("親カテゴリ情報が取得できませんでした");
    }
    const clan = await new ClanRepository().getClanByDiscordCategoryId(channel.parentId);
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }
    if (clan.id == null) {
      throw new Error("クランIDが取得できませんでした");
    }
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id,
      interaction.channel.id,
    );
    if (boss == null) {
      throw new Error("ボス情報が取得できませんでした");
    }
    // イベント情報取得
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    if (event.id == null) {
      throw new Error("イベントIDが取得できませんでした");
    }
    // ユーザー取得
    const user = await new UserRepository().getUserByDiscordUserIdAndClanId(
      interaction.user.id,
      clan.id,
    );
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }
    if (user.id == null) {
      throw new Error("ユーザーIDが取得できませんでした");
    }

    if (!channel.isTextBased()) {
      throw new Error("interaction.channel is not TextBasedChannel");
    }
    await channel.send({
      content:
        "<@&" +
        clan.discordRoleId +
        "> 【救援依頼】" +
        user.name +
        "さんからの" +
        boss.bossNo +
        "ボス救援要請です！",
    });

    await interaction.reply({
      ephemeral: true,
      content: "救援依頼を送信しました",
    });
  }
}
