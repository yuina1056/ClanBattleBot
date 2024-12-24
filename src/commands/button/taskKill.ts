import { Button } from "@/commands/button/button";
import BossChannelMessage from "@/messages/BossChannelMessage";
import { BossRepository } from "@/repository/bossRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { EventRepository } from "@/repository/eventRepository";
import { TaskKillRepository } from "@/repository/taskKillRepository";
import { UserRepository } from "@/repository/userRepository";
import { ButtonBuilder, ButtonInteraction, ButtonStyle, Guild } from "discord.js";

export class TaskKill extends Button {
  static readonly customId = "task_kill";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(TaskKill.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("タスクキル");
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
    // 凸宣言取得
    const declaration =
      await new DeclarationRepository().getDeclarationByUserIdAndClanIdAndEventIdAndDayAndIsFinished(
        user.id,
        clan.id,
        event.id,
        event.getClanBattleDay(),
        false,
      );
    if (declaration == null) {
      await interaction.reply({
        content: "凸宣言がされていません。先に凸宣言を行ってください。",
        ephemeral: true,
      });
      return;
    }
    if (declaration.id == null) {
      throw new Error("declaration.id is null");
    }

    // すでにタスクキルしているか確認
    const taskKill = await new TaskKillRepository().findTaskKillByEventIdAndClanIdAndUserIdAndDay(
      event.id,
      clan.id,
      user.id,
      event.getClanBattleDay(),
    );
    if (taskKill != null) {
      await interaction.reply({
        content: "既に本日はタスクキルしています。",
        ephemeral: true,
      });
      return;
    }

    // DBに保存
    await new TaskKillRepository().create(event.id, clan.id, user.id, event.getClanBattleDay());
    // 凸宣言を取り消しする
    await new DeclarationRepository().deleteById(declaration.id);

    // クラン毎イベント情報取得
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id,
      event.id,
    );

    const declarations =
      await new DeclarationRepository().getDeclarationsByClanIdAndBossNoAndIsFinishedAndEventIdToRelationUser(
        clan.id,
        boss.bossNo,
        false,
        event.id,
      );
    await BossChannelMessage.sendMessage(interaction.channel, clan, boss, clanEvent, declarations);
    await interaction.reply({
      content: "タスクキルしました。凸消滅にご注意ください。",
      ephemeral: true,
    });
  }
}
