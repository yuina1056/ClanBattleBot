import {
  ActionRowBuilder,
  Message,
  TextBasedChannel,
  ButtonBuilder,
  codeBlock,
  bold,
  time,
} from "discord.js";

import dataSource from "@/datasource";
import button_reload_attack_status from "@/commands/button/reload_attack_status";
import button_manage_menu from "@/commands/button/ManageMenu";

import User from "@/entity/User";
import Event from "@/entity/Event";
import Clan from "@/entity/Clan";
import Report from "@/entity/Report";
import Boss from "@/entity/Boss";
import Lap from "@/entity/Lap";
import EventBoss from "@/entity/EventBoss";

export async function sendMessage(
  channel: TextBasedChannel,
  message: Message | null,
  clan: Clan,
  users: User[],
  event: Event | null,
  eventBoss: EventBoss | null,
  isInit: boolean
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
  let latestReport: Report;
  let latestReportTime: string;
  if (todayReports.length !== 0) {
    latestReport = todayReports.reduce((a, b) =>
      a.UpdatedAt! > b.UpdatedAt! ? a : b
    );
    latestReportTime = latestReport.UpdatedAt
      ? time(latestReport.UpdatedAt)
      : "-";
  }

  // const clanStatus: string =
  //   clanTitle + codeBlock(clanProfile + latestreportTime);

  // 凸数
  const attackedCount = todayReports.filter((report) => {
    return report.isCarryOver == false;
  }).length;
  // TODO 持ち越し凸の数を加える
  const notAttackCount = users.length * 3 - attackedCount;
  const attackStatus = codeBlock(
    "残凸: " + notAttackCount + " 凸 x 持\n" + "済凸: " + attackedCount + " 凸"
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
  // TODO ボスHP情報を盛り込む
  let bossStatusCodeBlock = "";
  if (event !== null) {
    bossStatusCodeBlock = codeBlock(
      bosses[0].bossid +
        " (" +
        lap.boss1Lap +
        "周)\n" +
        eventBoss?.boss1HP +
        " / 00000 \n" +
        bosses[1].bossid +
        " (" +
        lap.boss2Lap +
        "周)\n" +
        eventBoss?.boss2HP +
        " / 00000 \n" +
        bosses[2].bossid +
        " (" +
        lap.boss3Lap +
        "周)\n" +
        eventBoss?.boss3HP +
        " / 00000 \n" +
        bosses[3].bossid +
        " (" +
        lap.boss4Lap +
        "周)\n" +
        eventBoss?.boss4HP +
        " / 00000 \n" +
        bosses[4].bossid +
        " (" +
        lap.boss5Lap +
        "周)\n" +
        eventBoss?.boss5HP +
        " / 00000 \n"
    );
  } else {
    bossStatusCodeBlock = codeBlock(
      1 +
        " (" +
        1 +
        "周)\n" +
        "  xxxx / 00000 \n" +
        2 +
        " (" +
        1 +
        "周)\n" +
        "  xxxx / 00000 \n" +
        3 +
        " (" +
        1 +
        "周)\n" +
        "  xxxx / 00000 \n" +
        4 +
        " (" +
        1 +
        "周)\n" +
        "  xxxx / 00000 \n" +
        5 +
        " (" +
        1 +
        "周)\n" +
        "  xxxx / 00000 \n"
    );
  }
  const bossStatus = bossStatusCodeBlock;

  const content: string =
    // userStatusContent + clanStatus + attackStatus + bossStatus;
    userStatusContent + attackStatus + bossStatus;
  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      button_reload_attack_status.data,
      button_manage_menu.data
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
