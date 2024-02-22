import {
  ActionRowBuilder,
  Message,
  TextBasedChannel,
  ButtonBuilder,
  codeBlock,
  bold,
  // time,
} from "discord.js";

import { ReloadAttackStatus } from "@/commands/button/reloadAttackStatus";
import { ManageMenu } from "@/commands/button/manageMenu";

import User from "@/entity/User";
import Event from "@/entity/Event";
import Clan from "@/entity/Clan";
import Report from "@/entity/Report";
import Config from "@/config/config";
import { ReportRepository } from "@/repository/reportRepository";
import { BossRepository } from "@/repository/bossRepository";
import ClanEvent from "@/entity/ClanEvent";

export async function sendMessage(
  channel: TextBasedChannel,
  message: Message | null,
  clan: Clan,
  users: User[],
  event: Event | null,
  clanEvent: ClanEvent | null,
  isInit: boolean,
) {
  if (clan.id == null) {
    throw new Error("clan.id is null");
  }
  let userStatus = "メンバー(" + users.length + ")\n";
  users.forEach((user) => {
    userStatus += user.getAttackStatus(event) + "\n";
  });
  const userStatusContent: string = codeBlock(userStatus);

  // クラン紹介
  const clanTitle: string = bold("凸状況") + "\n";
  const clanProfile: string = "# " + clan.name + " (" + users.length + "人)\n";
  const reportRepository = new ReportRepository();

  let todayReports: Report[] = [];
  if (event !== null) {
    if (event.id == null) {
      throw new Error("event.id is null");
    }
    todayReports = await reportRepository.getByClanIdAndEventIdAndDay(
      clan.id,
      event.id,
      event.getClanBattleDay(),
    );
  }
  // let latestReport: Report;
  // let latestReportTime: string;
  // if (todayReports.length !== 0) {
  // latestReport = todayReports.reduce((a, b) => (a.UpdatedAt! > b.UpdatedAt! ? a : b));
  // latestReportTime = latestReport.UpdatedAt ? time(latestReport.UpdatedAt) : "-";
  // }

  const clanStatus: string =
    clanTitle +
    codeBlock(
      clanProfile,
      //+ latestreportTime
    );

  // 凸数
  const attackedCount = todayReports.filter((report) => {
    return report.isCarryOver == false;
  }).length;
  const carryOverCount =
    todayReports.filter((report) => {
      return report.isCarryOver == true;
    }).length -
    todayReports.filter((report) => {
      return report.isAttackCarryOver == true;
    }).length;
  const notAttackCount = users.length * 3 - attackedCount - carryOverCount;
  const attackStatus = codeBlock(
    "残凸: " +
      notAttackCount +
      " 凸 " +
      carryOverCount +
      " 持\n" +
      "済凸: " +
      attackedCount +
      " 凸",
  );

  if (clanEvent == null) {
    throw new Error("clanEvent is null");
  }

  // ボス状況
  const bossRepository = new BossRepository();
  const bosses = await bossRepository.getAll();
  let bossStatusCodeBlock = "";
  if (event !== null) {
    bossStatusCodeBlock = codeBlock(
      bosses[0].bossNo +
        " ( " +
        String(clanEvent.boss1Lap).padStart(2) +
        "周目 )" +
        (clanEvent.isAttackPossible(1) ? "" : "💎") +
        "\n" +
        String(clanEvent?.boss1HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss1HP[clanEvent.getCurrentStage(bosses[0].bossNo)] +
        " \n" +
        bosses[1].bossNo +
        " ( " +
        String(clanEvent.boss2Lap).padStart(2) +
        "周目 )" +
        (clanEvent.isAttackPossible(2) ? "" : "💎") +
        "\n" +
        String(clanEvent?.boss2HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss2HP[clanEvent.getCurrentStage(bosses[1].bossNo)] +
        "\n" +
        bosses[2].bossNo +
        " ( " +
        String(clanEvent.boss3Lap).padStart(2) +
        "周目 )" +
        (clanEvent.isAttackPossible(3) ? "" : "💎") +
        "\n" +
        String(clanEvent?.boss3HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss3HP[clanEvent.getCurrentStage(bosses[2].bossNo)] +
        "\n" +
        bosses[3].bossNo +
        " ( " +
        String(clanEvent.boss4Lap).padStart(2) +
        "周目 )" +
        (clanEvent.isAttackPossible(4) ? "" : "💎") +
        "\n" +
        String(clanEvent?.boss4HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss4HP[clanEvent.getCurrentStage(bosses[3].bossNo)] +
        "\n" +
        bosses[4].bossNo +
        " ( " +
        String(clanEvent.boss5Lap).padStart(2) +
        "周目 )" +
        (clanEvent.isAttackPossible(5) ? "" : "💎") +
        "\n" +
        String(clanEvent?.boss5HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss5HP[clanEvent.getCurrentStage(bosses[4].bossNo)] +
        "\n",
    );
  } else {
    bossStatusCodeBlock = codeBlock(
      1 +
        " (" +
        1 +
        "周)\n" +
        "    " +
        Config.BossHPConfig.boss1HP[1] +
        " / " +
        Config.BossHPConfig.boss1HP[1] +
        " \n" +
        2 +
        " (" +
        1 +
        "周)\n" +
        "    " +
        Config.BossHPConfig.boss1HP[2] +
        " / " +
        Config.BossHPConfig.boss1HP[2] +
        " \n" +
        3 +
        " (" +
        1 +
        "周)\n" +
        "    " +
        Config.BossHPConfig.boss1HP[3] +
        " / " +
        Config.BossHPConfig.boss1HP[3] +
        " \n" +
        4 +
        " (" +
        1 +
        "周)\n" +
        "    " +
        Config.BossHPConfig.boss1HP[4] +
        " / " +
        Config.BossHPConfig.boss1HP[4] +
        " \n" +
        5 +
        " (" +
        1 +
        "周)\n" +
        "    " +
        Config.BossHPConfig.boss1HP[5] +
        " / " +
        Config.BossHPConfig.boss1HP[5] +
        " \n",
    );
  }
  const bossStatus = bossStatusCodeBlock;

  const content: string = userStatusContent + clanStatus + attackStatus + bossStatus;

  const reloadAttackStatus = new ReloadAttackStatus();
  const manageMenu = new ManageMenu();

  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      reloadAttackStatus.button,
      manageMenu.button,
    ),
  ];
  if (isInit) {
    await channel.send({
      content: content,
      components: components,
    });
  } else {
    if (message != null) {
      await message.edit({
        content: content,
        components: components,
      });
    }
  }
}

export default {
  sendMessage,
};
