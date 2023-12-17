import {
  ActionRowBuilder,
  Message,
  TextBasedChannel,
  ButtonBuilder,
  codeBlock,
  bold,
  // time,
} from "discord.js";

import dataSource from "@/datasource";
import button_reload_attack_status from "@/commands/button/reload_attack_status";
import { ManageMenu } from "@/commands/button/ManageMenu";

import User from "@/entity/User";
import Event from "@/entity/Event";
import Clan from "@/entity/Clan";
import Report from "@/entity/Report";
import Boss from "@/entity/Boss";
import Lap from "@/entity/Lap";
import EventBoss from "@/entity/EventBoss";
import Config from "@/config/config";

export async function sendMessage(
  channel: TextBasedChannel,
  message: Message | null,
  clan: Clan,
  users: User[],
  event: Event | null,
  eventBoss: EventBoss | null,
  isInit: boolean,
) {
  let userStatus = "メンバー(" + users.length + ")\n";
  users.forEach((user) => {
    userStatus += user.getAttackStatus(event) + "\n";
  });
  const userStatusContent: string = codeBlock(userStatus);

  // クラン紹介
  const clanTitle: string = bold("凸状況") + "\n";
  const clanProfile: string = "# " + clan.name + " (" + users.length + "人)\n";
  const reportRepository = dataSource.getRepository(Report);

  let todayReports: Report[] = [];
  if (event !== null) {
    todayReports = await reportRepository.find({
      where: {
        clanId: clan.id,
        eventId: event.id,
        day: event.getClanBattleDay(),
      },
    });
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

  // 周回数
  const lapRepository = dataSource.getRepository(Lap);
  let lap: Lap | null = null;
  if (event !== null) {
    lap = await lapRepository.findOneBy({
      clanId: clan.id,
      eventId: event.id,
    });
  } else {
    lap = new Lap(clan.id ?? 0, 0);
  }

  if (lap == null) {
    throw new Error("lap is null");
  }

  // ボス状況
  const bossRepository = dataSource.getRepository(Boss);
  const bosses = await bossRepository.find();
  // TODO 各段階ボスの満タンHP情報を盛り込む。HPは４段階目のみになっているため、段階ごとに切り替えられるようにする必要がある。
  let bossStatusCodeBlock = "";
  if (event !== null) {
    bossStatusCodeBlock = codeBlock(
      bosses[0].bossid +
        " ( " +
        String(lap.boss1Lap).padStart(2) +
        "周目 )" +
        (lap.isAttackPossible(1) ? "" : "💎") +
        "\n" +
        String(eventBoss?.boss1HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss1HP[lap.getCurrentStage(bosses[0].bossid)] +
        " \n" +
        bosses[1].bossid +
        " ( " +
        String(lap.boss2Lap).padStart(2) +
        "周目 )" +
        (lap.isAttackPossible(2) ? "" : "💎") +
        "\n" +
        String(eventBoss?.boss2HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss2HP[lap.getCurrentStage(bosses[1].bossid)] +
        "\n" +
        bosses[2].bossid +
        " ( " +
        String(lap.boss3Lap).padStart(2) +
        "周目 )" +
        (lap.isAttackPossible(3) ? "" : "💎") +
        "\n" +
        String(eventBoss?.boss3HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss3HP[lap.getCurrentStage(bosses[2].bossid)] +
        "\n" +
        bosses[3].bossid +
        " ( " +
        String(lap.boss4Lap).padStart(2) +
        "周目 )" +
        (lap.isAttackPossible(4) ? "" : "💎") +
        "\n" +
        String(eventBoss?.boss4HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss4HP[lap.getCurrentStage(bosses[3].bossid)] +
        "\n" +
        bosses[4].bossid +
        " ( " +
        String(lap.boss5Lap).padStart(2) +
        "周目 )" +
        (lap.isAttackPossible(5) ? "" : "💎") +
        "\n" +
        String(eventBoss?.boss5HP).padStart(5) +
        " / " +
        Config.BossHPConfig.boss5HP[lap.getCurrentStage(bosses[4].bossid)] +
        "\n",
    );
  } else {
    bossStatusCodeBlock = codeBlock(
      1 +
        " (" +
        1 +
        "周)\n" +
        "    800 / 800 \n" +
        2 +
        " (" +
        1 +
        "周)\n" +
        "   1000 / 1000 \n" +
        3 +
        " (" +
        1 +
        "周)\n" +
        "   1300 / 1300 \n" +
        4 +
        " (" +
        1 +
        "周)\n" +
        "   1500 / 1500 \n" +
        5 +
        " (" +
        1 +
        "周)\n" +
        "   2000 / 2000 \n",
    );
  }
  const bossStatus = bossStatusCodeBlock;

  const content: string = userStatusContent + clanStatus + attackStatus + bossStatus;

  const manageMenu = new ManageMenu();
  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      button_reload_attack_status.data,
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
