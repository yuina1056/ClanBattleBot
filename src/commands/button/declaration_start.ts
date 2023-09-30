import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ActionRowBuilder,
} from "discord.js";
import dayjs from "dayjs";

import DataSource from "@/datasource";
import Boss from "@/entity/Boss";
import Event from "@/entity/Event";
import Report from "@/entity/Report";
import User from "@/entity/User";
import buttonAttackFirst from "@/commands/button/DeclarationFirst";
import buttonAttackSecond from "@/commands/button/DeclarationSecond";
import buttonAttackThird from "@/commands/button/DeclarationThird";
import buttonAttackFirstAsCarryOver from "@/commands/button/DeclarationFirstAsCarryOver";
import buttonAttackSecondAsCarryOver from "@/commands/button/DeclarationSecondAsCarryOver";
import buttonAttackThirdAsCarryOver from "@/commands/button/DeclarationThirdAsCarryOver";

export const customId = "declaration_start";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("凸宣言");

/**
 * 凸宣言を実施するためのボタンを呼び出します。
 *
 * @param interaction 押されたボタン
 * @return なし
 */
export async function execute(interaction: ButtonInteraction) {
  const today = dayjs().format();
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder("event")
    .where("event.fromDate <= :today", { today })
    .andWhere("event.toDate >= :today", { today })
    .getOne();
  if (event == null) {
    throw new Error("クランバトル開催情報が取得できませんでした");
  }
  const dayCount = event.getClanBattleDay();

  const interactionUserId = interaction.user.id;
  const clanUser = await DataSource.getRepository(User)
    .createQueryBuilder("user")
    .where("user.discordUserId = :userId", { interactionUserId })
    .getOne();
  if (clanUser == null) {
    return new Error("あなたはこのクランに所属していないよ");
  }

  const interactionChannelId = interaction.channelId;
  const boss = await DataSource.getRepository(Boss)
    .createQueryBuilder("boss")
    .where("boss.discordChannelId = :channelId", { interactionChannelId })
    .getOne();
  if (boss == null) {
    return new Error("ボス情報を取得できません");
  }

  const todayReports = clanUser.getTodayReports(event, dayCount);

  // なし:- 持ち越しなし:x　持ち越しあり:y　持ち越し済み:z

  if (todayReports == null) {
    // ---
    await interaction.reply({
      content:
        "【宣言】" +
        clanUser.name +
        "さんの x周目 " +
        boss.bossid +
        "ボス 宣言だよ。",
      ephemeral: true,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          buttonAttackFirst.data
        ),
      ],
    });
    return;
  }

  // 各凸状況を収集する
  const firstAttacks = todayReports.filter((report) => {
    return report.attackCount == 1;
  });
  const secondAttacks = todayReports.filter((report) => {
    return report.attackCount == 2;
  });
  const thirdAttacks = todayReports.filter((report) => {
    return report.attackCount == 3;
  });

  if (
    firstAttacks.length != 0 &&
    secondAttacks.length == 0 &&
    thirdAttacks.length == 0
  ) {
    if (isFinishedOnAttack(firstAttacks)) {
      // z--
      await interaction.reply({
        content:
          "【宣言】" +
          clanUser.name +
          "さんの x周目 " +
          boss.bossid +
          "ボス 宣言だよ。",
        ephemeral: true,
        components: [
          // 2凸目を選択してもらう
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttonAttackSecond.data
          ),
        ],
      });
    } else {
      // y--
      await interaction.reply({
        content:
          "【宣言】" +
          clanUser.name +
          "さんの x周目 " +
          boss.bossid +
          "ボス 宣言だよ。",
        ephemeral: true,
        components: [
          // 1凸目の持ち越しか2凸目を選択してもらう
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttonAttackFirstAsCarryOver.data,
            buttonAttackSecond.data
          ),
        ],
      });
    }
  }

  if (
    firstAttacks.length != 0 &&
    secondAttacks.length != 0 &&
    thirdAttacks.length == 0
  ) {
    if (isFinishedOnAttack(firstAttacks)) {
      if (isFinishedOnAttack(secondAttacks)) {
        // zz-
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの x周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 3凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              buttonAttackThird.data
            ),
          ],
        });
      } else {
        // zy-
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの x周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 2凸目の持ち越しか3凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              buttonAttackSecondAsCarryOver.data,
              buttonAttackThird.data
            ),
          ],
        });
      }
    } else {
      if (isFinishedOnAttack(secondAttacks)) {
        // yz-
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの x周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 1凸目の持ち越しか3凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              buttonAttackFirstAsCarryOver.data,
              buttonAttackThird.data
            ),
          ],
        });
      } else {
        // yy-
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの x周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 1凸目の持ち越しか2凸目の持ち越しか3凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              buttonAttackFirstAsCarryOver.data,
              buttonAttackSecondAsCarryOver.data,
              buttonAttackThird.data
            ),
          ],
        });
      }
    }
  }

  if (
    firstAttacks.length != 0 &&
    secondAttacks.length != 0 &&
    thirdAttacks.length != 0
  ) {
    if (isFinishedOnAttack(firstAttacks)) {
      if (isFinishedOnAttack(secondAttacks)) {
        if (isFinishedOnAttack(thirdAttacks)) {
          // zzz
          await interaction.reply({
            content: "本日の凸は完了しています",
            ephemeral: true,
          });
        } else {
          // zzy
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              // 3凸目の持ち越しを消化してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackThirdAsCarryOver.data
              ),
            ],
          });
        }
      } else {
        if (isFinishedOnAttack(secondAttacks)) {
          // zyz
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              // 2凸目の持ち越しを消化してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackSecondAsCarryOver.data
              ),
            ],
          });
        } else {
          // zyy
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              // 2凸目の持ち越しか3凸目の持ち越しを消化してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackSecondAsCarryOver.data,
                buttonAttackThirdAsCarryOver.data
              ),
            ],
          });
        }
      }
    } else {
      if (isFinishedOnAttack(secondAttacks)) {
        if (isFinishedOnAttack(thirdAttacks)) {
          // yzz
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackFirstAsCarryOver.data
              ),
            ],
          });
        } else {
          // yzy
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackFirstAsCarryOver.data,
                buttonAttackThirdAsCarryOver.data
              ),
            ],
          });
        }
      } else {
        if (isFinishedOnAttack(thirdAttacks)) {
          // yyz
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackFirstAsCarryOver.data,
                buttonAttackSecondAsCarryOver.data
              ),
            ],
          });
        } else {
          // yyy
          await interaction.reply({
            content: "凸宣言する凸を選択してください",
            ephemeral: true,
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonAttackFirstAsCarryOver.data,
                buttonAttackSecondAsCarryOver.data,
                buttonAttackThirdAsCarryOver.data
              ),
            ],
          });
        }
      }
    }
  }
}

/**
 * 各凸における凸完了を判定します。
 *
 * @param attacks 判定する凸のレポート群
 * @return 完了判定結果
 */
function isFinishedOnAttack(attacks: Report[]): boolean {
  if (attacks.length == 2) {
    return true;
  } else if (attacks.length == 1 && attacks[0].isDefeat == false) {
    return true;
  } else {
    return false;
  }
}

export default {
  customId,
  data,
  execute,
};
