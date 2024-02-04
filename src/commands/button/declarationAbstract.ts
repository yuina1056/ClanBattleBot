/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonInteraction, Guild } from "discord.js";

import Declaration from "@/app/model/Declaration";

import BossChannelMessage from "@/messages/BossChannelMessage";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";

export abstract class DeclarationAbstract extends Button {
  abstract attackCount: number;
  abstract isAttackCarryOver: boolean;

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
    // ボス情報取得
    const boss = await new BossRepository().getBossByClanIdAndChannelId(
      clan.id ?? 0,
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

    // クラン毎イベント情報取得
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id!,
      event.id!,
    );
    let bossLap = 0;
    if (clanEvent != null) {
      switch (boss.bossid) {
        case 1:
          bossLap = clanEvent.boss1Lap ?? 1;
          break;
        case 2:
          bossLap = clanEvent.boss2Lap ?? 1;
          break;
        case 3:
          bossLap = clanEvent.boss3Lap ?? 1;
          break;
        case 4:
          bossLap = clanEvent.boss4Lap ?? 1;
          break;
        case 5:
          bossLap = clanEvent.boss5Lap ?? 1;
          break;
        default:
          break;
      }
    }

    const user = await Declaration.regist(
      boss,
      interaction.user.id,
      bossLap,
      this.attackCount,
      this.isAttackCarryOver,
      event,
    );
    if (user instanceof Error) {
      await interaction.reply({
        content: user.message,
        ephemeral: true,
      });
      return;
    }

    const declarations =
      await new DeclarationRepository().getDeclarationsByClanIdAndBossIdAndIsFinishedToRelationUser(
        clan.id!,
        boss.bossid!,
        false,
      );

    await BossChannelMessage.sendMessage(interaction.channel, clan, boss, clanEvent, declarations);
    const deleteMessage = await channel.messages.fetch(
      interaction.message.reference?.messageId ?? "",
    );
    await deleteMessage.delete();
    if (!channel.isTextBased()) {
      throw new Error("interaction.channel is not TextBasedChannel");
    }
    await interaction.deferUpdate();
    await channel.send({
      content:
        "【" +
        bossLap +
        "週目】" +
        user.name +
        "が" +
        boss.bossid +
        "ボスに" +
        (this.isAttackCarryOver ? "持越" : "本戦") +
        "凸宣言しました",
    });
  }
}
