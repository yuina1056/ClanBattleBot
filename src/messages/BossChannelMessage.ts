import { ActionRowBuilder, EmbedBuilder, TextBasedChannel, ButtonBuilder } from "discord.js";

import { DeclarationStart } from "@/commands/button/declarationStart";
import { ReportShave } from "@/commands/button/reportShave";
import { ReportDefeat } from "@/commands/button/reportDefeat";
import { DeclarationCancel } from "@/commands/button/declarationCancel";
import Clan from "@/entity/Clan";
import Boss from "@/entity/Boss";
import Declaration from "@/entity/Declaration";
import Config from "@/config/config";
import ClanEvent from "@/entity/ClanEvent";

export async function sendMessage(
  channel: TextBasedChannel,
  clan: Clan,
  boss: Boss,
  clanEvent: ClanEvent | null,
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
  let bossHp = 0;
  let bossMaxHp = 0;
  if (clanEvent != null) {
    switch (boss.bossNo) {
      case 1:
        bossLap = clanEvent.boss1Lap ?? 1;
        bossMaxHp = Config.BossHPConfig.boss1HP[clanEvent.getCurrentStage(1)];
        bossHp = clanEvent.boss1HP ?? 0;
        break;
      case 2:
        bossLap = clanEvent.boss2Lap ?? 1;
        bossMaxHp = Config.BossHPConfig.boss2HP[clanEvent.getCurrentStage(2)];
        bossHp = clanEvent.boss2HP ?? 0;
        break;
      case 3:
        bossLap = clanEvent.boss3Lap ?? 1;
        bossMaxHp = Config.BossHPConfig.boss3HP[clanEvent.getCurrentStage(3)];
        bossHp = clanEvent.boss3HP ?? 0;
        break;
      case 4:
        bossLap = clanEvent.boss4Lap ?? 1;
        bossMaxHp = Config.BossHPConfig.boss4HP[clanEvent.getCurrentStage(4)];
        bossHp = clanEvent.boss4HP ?? 0;
        break;
      case 5:
        bossLap = clanEvent.boss5Lap ?? 1;
        bossMaxHp = Config.BossHPConfig.boss5HP[clanEvent.getCurrentStage(5)];
        bossHp = clanEvent.boss5HP ?? 0;
        break;
      default:
        break;
    }
  }

  // コンポーネント定義
  const embed = new EmbedBuilder()
    .setTitle(boss.bossNo + "ボス")
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
  const reportShave = new ReportShave();

  await channel.send({
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        declarationStart.button,
        reportShave.button,
        reportDefeat.button,
        declarationCancel.button,
      ),
    ],
  });
}

export default {
  sendMessage,
};
