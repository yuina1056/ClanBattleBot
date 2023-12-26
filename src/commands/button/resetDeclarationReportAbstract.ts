/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonInteraction, Guild } from "discord.js";

import { Button } from "@/commands/button/button";
import { EventRepository } from "@/repository/eventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { UserRepository } from "@/repository/userRepository";
import { ReportRepository } from "@/repository/reportRepository";

export abstract class ResetDeclarationReportAbstract extends Button {
  abstract attackCount: number;

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
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("クランバトル開催情報が取得できませんでした");
    }
    // ユーザー取得
    const user = await new UserRepository().getUserByDiscordUserIdAndClanId(
      interaction.user.id,
      clan.id!,
    );
    if (user == null) {
      throw new Error("ユーザー情報が取得できませんでした");
    }

    // 削除処理
    await new DeclarationRepository().deleteByUserIdAndEventIdAndDayAndAttackCount(
      user.id!,
      event.id!,
      event.getClanBattleDay(),
      this.attackCount,
    );
    await new ReportRepository().deleteByUserIdAndEventIdAndDayAndAttackCount(
      user.id!,
      event.id!,
      event.getClanBattleDay(),
      this.attackCount,
    );

    await interaction.reply({
      content: this.attackCount + "凸目の宣言・報告をリセットしました。",
      ephemeral: true,
    });
  }
}
