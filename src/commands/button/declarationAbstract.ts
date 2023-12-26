/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonInteraction, Guild } from "discord.js";

import Declaration from "@/app/model/Declaration";
import DataSource from "@/repository/repository";

import BossChannelMessage from "@/messages/BossChannelMessage";
import EventBoss from "@/entity/EventBoss";
import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { BossRepository } from "@/repository/bossRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { LapRepository } from "@/repository/lapRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";

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

    // 周回数取得
    const lap = await new LapRepository().getLapByEventIdAndClanId(event.id!, clan.id!);
    let bossLap = 0;
    if (lap != null) {
      switch (boss.bossid) {
        case 1:
          bossLap = lap.boss1Lap ?? 1;
          break;
        case 2:
          bossLap = lap.boss2Lap ?? 1;
          break;
        case 3:
          bossLap = lap.boss3Lap ?? 1;
          break;
        case 4:
          bossLap = lap.boss4Lap ?? 1;
          break;
        case 5:
          bossLap = lap.boss5Lap ?? 1;
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
      await new DeclarationRepository().getDeclarationsByBossIdAndIsFinishedToRelationUser(
        boss.id!,
        false,
      );

    const eventBossRepository = DataSource.getRepository(EventBoss);
    const eventBoss = await eventBossRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
    if (eventBoss == null) {
      throw new Error("クランバトルボスのHP情報が取得できませんでした");
    }

    await BossChannelMessage.sendMessage(
      interaction.channel,
      clan,
      boss,
      eventBoss,
      lap,
      declarations,
    );
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
