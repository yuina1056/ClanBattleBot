import { ActionRowBuilder, EmbedBuilder, TextBasedChannel, ButtonBuilder } from "discord.js";

import { DeclarationStart } from "@/commands/button/declaration_start";
import button_report_shave from "@/commands/button/report_shave";
import { ReportDefeat } from "@/commands/button/report_defeat";
import { DeclarationCancel } from "@/commands/button/declaration_cancel";
import Clan from "@/entity/Clan";
import Boss from "@/entity/Boss";
import Declaration from "@/entity/Declaration";
import Lap from "@/entity/Lap";
import EventBoss from "@/entity/EventBoss";
import Config from "@/config/config";

export async function sendMessage(
  channel: TextBasedChannel,
  clan: Clan,
  boss: Boss,
  eventBoss: EventBoss | null,
  lap: Lap | null,
  declaration: Declaration[],
) {
  let declarationMember = "凸宣言者なし";
  if (declaration.length > 0) {
    declarationMember = "";
    declaration.forEach((declaration) => {
      declarationMember = declarationMember + "\n" + declaration.user.name;
    });
  }
  let bossLap = 1;
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
  let bossHp = 0;
  let bossMaxHp = 0;
  if (eventBoss != null) {
    switch (boss.bossid) {
      case 1:
        if (lap == null) {
          bossMaxHp = Config.BossHPConfig.boss1HP[2];
        } else {
          bossMaxHp = Config.BossHPConfig.boss1HP[lap.getCurrentStage(1)];
        }
        bossHp = eventBoss.boss1HP ?? 0;
        break;
      case 2:
        if (lap == null) {
          bossMaxHp = Config.BossHPConfig.boss2HP[2];
        } else {
          bossMaxHp = Config.BossHPConfig.boss2HP[lap.getCurrentStage(2)];
        }
        bossHp = eventBoss.boss2HP ?? 0;
        break;
      case 3:
        if (lap == null) {
          bossMaxHp = Config.BossHPConfig.boss3HP[2];
        } else {
          bossMaxHp = Config.BossHPConfig.boss3HP[lap.getCurrentStage(3)];
        }
        bossHp = eventBoss.boss3HP ?? 0;
        break;
      case 4:
        if (lap == null) {
          bossMaxHp = Config.BossHPConfig.boss4HP[2];
        } else {
          bossMaxHp = Config.BossHPConfig.boss4HP[lap.getCurrentStage(4)];
        }
        bossHp = eventBoss.boss4HP ?? 0;
        break;
      case 5:
        if (lap == null) {
          bossMaxHp = Config.BossHPConfig.boss5HP[2];
        } else {
          bossMaxHp = Config.BossHPConfig.boss5HP[lap.getCurrentStage(5)];
        }
        bossHp = eventBoss.boss5HP ?? 0;
        break;
      default:
        break;
    }
  }

  // コンポーネント定義
  const embed = new EmbedBuilder()
    .setTitle(boss.bossid + "ボス")
    .setColor("#00ff00")
    .setFields(
      {
        name: "クラン名",
        value: clan.name,
      },
      {
        name: "周回数",
        value: bossLap + "周目",
      },
      {
        name: "HP",
        value: bossHp.toString() + "/ " + bossMaxHp.toString(),
      },
      {
        name: "凸宣言者",
        value: declarationMember,
      },
    );

  const declarationStart = new DeclarationStart();
  const declarationCancel = new DeclarationCancel();
  const reportDefeat = new ReportDefeat();

  await channel.send({
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        declarationStart.data,
        button_report_shave.data,
        reportDefeat.data,
        declarationCancel.data,
      ),
    ],
  });
}

export default {
  sendMessage,
};
