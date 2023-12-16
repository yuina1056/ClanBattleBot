/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Declaration from "@/entity/Declaration";
import Lap from "@/entity/Lap";
import Event from "@/entity/Event";
import Report from "@/entity/Report";
import User from "@/entity/User";
import BossChannelMessage from "@/messages/BossChannelMessage";
import dayjs from "dayjs";
import {
  ActionRowBuilder,
  Guild,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import DataSource from "@/datasource";
import EventBoss from "@/entity/EventBoss";
import Config from "@/config/config";

export const customId = "report_shave";
const text_remaining_hp_customId = "remaining_hp";

export async function createModal(hp: number): Promise<ModalBuilder> {
  const modal = new ModalBuilder().setTitle("凸報告：残HP報告").setCustomId(customId);
  const ActionRowRemainingHP = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("残HP")
      .setCustomId(text_remaining_hp_customId)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(hp.toString())
      .setRequired(true),
  );
  modal.addComponents(ActionRowRemainingHP);
  return modal;
}

export async function submit(interaction: ModalSubmitInteraction) {
  let guild: Guild;
  if (interaction.guild != null) {
    guild = interaction.guild;
  } else {
    throw new Error("interaction.guild is null");
  }
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder("event")
    .where("event.fromDate <= :today", { today })
    .andWhere("event.toDate >= :today", { today })
    .getOne();
  if (event == null) {
    throw new Error("クランバトル開催情報が取得できませんでした");
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id);
  if (channel == null) {
    throw new Error("channel is null");
  }
  if (channel.parentId == null) {
    throw new Error("channel.parentId is null");
  }
  const clan = await DataSource.getRepository(Clan).findOneBy({
    discordCategoryId: channel!.parentId!,
  });
  if (clan == null) {
    throw new Error("クラン情報が取得できませんでした");
  }
  // ボス情報取得
  const bossRepository = DataSource.getRepository(Boss);
  const boss = await bossRepository.findOneBy({
    discordChannelId: interaction.channel!.id,
  });
  if (boss == null) {
    throw new Error("ボス情報が取得できませんでした");
  }

  // 周回数取得
  const lapRepository = DataSource.getRepository(Lap);
  const lap = await lapRepository.findOneBy({
    eventId: event.id,
    clanId: clan.id,
  });
  if (lap == null) {
    throw new Error("周回数が取得できませんでした");
  }
  let bossLap = 0;
  switch (boss.bossid) {
    case 1:
      bossLap = lap.boss1Lap ?? 0;
      break;
    case 2:
      bossLap = lap.boss2Lap ?? 0;
      break;
    case 3:
      bossLap = lap.boss3Lap ?? 0;
      break;
    case 4:
      bossLap = lap.boss4Lap ?? 0;
      break;
    case 5:
      bossLap = lap.boss5Lap ?? 0;
      break;
    default:
      break;
  }
  // ユーザー取得
  const userRepository = DataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    discordUserId: interaction.user.id,
    clanId: clan?.id,
  });
  if (user == null) {
    throw new Error("ユーザー情報が取得できませんでした");
  }

  const eventBossRepository = DataSource.getRepository(EventBoss);
  const eventBoss = await eventBossRepository.findOneBy({
    clanId: clan.id,
    eventId: event.id,
  });
  if (eventBoss == null) {
    throw new Error("クランバトルボスのHP情報が取得できませんでした");
  }

  const inputHP = Number(interaction.fields.getTextInputValue(text_remaining_hp_customId));
  if (isNaN(inputHP)) {
    throw new Error("入力値が不正です。数値を入力してください");
  }
  if (inputHP <= 0) {
    throw new Error("残HPが0になる時は撃破ボタンを押して報告してください");
  }

  switch (boss.bossid) {
    case 1:
      if (Config.BossHPConfig.boss1HP[lap.getCurrentStage(1)] < inputHP) {
        await interaction.reply({
          content: "撃破処理できませんでした。残HPがボスのHPを超えています",
          ephemeral: true,
        });
        return;
      }
      eventBoss.boss1HP = inputHP;
      break;
    case 2:
      if (Config.BossHPConfig.boss2HP[lap.getCurrentStage(2)] < inputHP) {
        await interaction.reply({
          content: "撃破処理できませんでした。残HPがボスのHPを超えています",
          ephemeral: true,
        });
        return;
      }
      eventBoss.boss2HP = inputHP;
      break;
    case 3:
      if (Config.BossHPConfig.boss3HP[lap.getCurrentStage(3)] < inputHP) {
        await interaction.reply({
          content: "撃破処理できませんでした。残HPがボスのHPを超えています",
          ephemeral: true,
        });
        return;
      }
      eventBoss.boss3HP = inputHP;
      break;
    case 4:
      if (Config.BossHPConfig.boss4HP[lap.getCurrentStage(4)] < inputHP) {
        await interaction.reply({
          content: "撃破処理できませんでした。残HPがボスのHPを超えています",
          ephemeral: true,
        });
        return;
      }
      eventBoss.boss4HP = inputHP;
      break;
    case 5:
      if (Config.BossHPConfig.boss5HP[lap.getCurrentStage(5)] < inputHP) {
        await interaction.reply({
          content: "撃破処理できませんでした。残HPがボスのHPを超えています",
          ephemeral: true,
        });
        return;
      }
      eventBoss.boss5HP = inputHP;
      break;
    default:
      break;
  }

  const declarationRepository = DataSource.getRepository(Declaration);
  const declaration = await declarationRepository.findOneBy({
    userId: user.id,
    clanId: clan.id,
    eventId: event.id,
    isFinished: false,
  });
  if (declaration == null) {
    await interaction.reply({
      content: "凸宣言がされていません",
      ephemeral: true,
    });
    return;
  }
  await declarationRepository.update(declaration!.id!, { isFinished: true });

  // DBに保存
  const report = new Report(
    user.clanId,
    user.id!,
    event!.id!,
    boss.bossid,
    bossLap,
    event.getClanBattleDay(),
    declaration.attackCount,
    declaration.isAttackCarryOver,
    0,
    false,
    false,
  );
  const reportRepository = DataSource.getRepository(Report);
  await reportRepository.save(report);

  const saveEventBoss = await eventBossRepository.save(eventBoss);

  const declarations = await DataSource.getRepository(Declaration).find({
    where: {
      bossId: boss.id,
      isFinished: false,
    },
    relations: {
      user: true,
    },
  });
  await BossChannelMessage.sendMessage(
    interaction.channel!,
    clan,
    boss,
    saveEventBoss,
    lap,
    declarations,
  );
  const deleteMessage = await channel.messages.fetch(interaction.message?.id ?? "");
  await deleteMessage.delete();
  if (!channel.isTextBased()) {
    throw new Error("interaction.channel is not TextBasedChannel");
  }
  await interaction.deferUpdate();
  await channel.send({
    content: "【" + bossLap + "周目】" + user.name + "が" + boss.bossid + "ボスを削りました",
  });
}

export default {
  customId,
  createModal,
  submit,
};
