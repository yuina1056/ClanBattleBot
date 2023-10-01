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

export async function sendMessage(
  channel: TextBasedChannel,
  message: Message | null,
  clan: Clan,
  users: User[],
  event: Event,
  isInit: boolean
) {
  let userStatus = "メンバー(" + users.length + ")\n";
  users.forEach((user) => {
    userStatus += user.getAttackStatus(event) + "\n";
  });
  const userStatusContent: string = codeBlock(userStatus);

  // クラン紹介
  const clanTitle: string = bold("凸状況") + "\n"
  const clanProfile: string = "# " + clan.name + " (" + users.length + "人)\n"
  const reportRepository = dataSource.getRepository(Report)
  const todayReports = await reportRepository.find({
    where: {
      clanId: clan.id,
      eventId: event.id,
      day: event.getClanBattleDay()
    }
  })
  const latestReport = todayReports.reduce((a, b) => a.UpdatedAt! > b.UpdatedAt! ? a : b)
  const latestreportTime: string = latestReport.UpdatedAt ?
    time(latestReport.UpdatedAt) :
    "-"
  const clanStatus: string =
    clanTitle + codeBlock(clanProfile + latestreportTime);
  
  // 凸数
  const attackedCount = todayReports.filter((report) => {
    return report.isCarryOver == false
  }).length
  // TODO 持ち越し凸の数を加える
  const notAttackCount = (users.length * 3) - attackedCount
  const attackStatus = codeBlock(
    "残凸: " + notAttackCount + " 凸 x 持\n" +
    "済凸: " + attackedCount + " 凸"
  )
  
  // ボス状況
  const bossRepository = dataSource.getRepository(Boss)
  const bosses = await bossRepository.find()
  // TODO ボスHP情報を盛り込む
  let bossStatus = codeBlock(
    bosses[0].bossid +
    " (" +
    clan.boss1Lap +
    "周)\n" +
    "  xxxx / 00000 \n" +
    bosses[1].bossid +
    " (" +
    clan.boss2Lap +
    "周)\n" +
    "  xxxx / 00000 \n" +
    bosses[2].bossid +
    " (" +
    clan.boss3Lap +
    "周)\n" +
    "  xxxx / 00000 \n" +
    bosses[3].bossid +
    " (" +
    clan.boss4Lap +
    "周)\n" +
    "  xxxx / 00000 \n" +
    bosses[4].bossid +
    " (" +
    clan.boss5Lap +
    "周)\n" +
    "  xxxx / 00000 \n"
  );

  const content: string = userStatusContent + clanStatus + attackStatus + bossStatus;
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
