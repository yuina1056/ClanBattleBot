import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder, Guild } from "discord.js";
import dayjs from "dayjs";

import DataSource from "@/repository/datasource";
import Boss from "@/entity/Boss";
import Event from "@/entity/Event";
import Report from "@/entity/Report";
import User from "@/entity/User";
import { DeclarationFirst } from "@/commands/button/declarationFirst";
import { DeclarationSecond } from "@/commands/button/declarationSecond";
import { DeclarationThird } from "@/commands/button/declarationThird";
import { DeclarationFirstAsCarryOver } from "@/commands/button/declarationFirstAsCarryOver";
import { DeclarationSecondAsCarryOver } from "@/commands/button/declarationSecondAsCarryOver";
import { DeclarationThirdAsCarryOver } from "@/commands/button/declarationThirdAsCarryOver";
import Lap from "@/entity/Lap";
import Clan from "@/entity/Clan";
import { Button } from "@/commands/button/button";

export class DeclarationStart extends Button {
  static readonly customId: string = "declaration_start";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(DeclarationStart.customId)
      .setStyle(ButtonStyle.Primary)
      .setLabel("凸宣言");
  }

  async execute(interaction: ButtonInteraction) {
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

    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel?.id);
    if (channel == null) {
      throw new Error("channel is null");
    }
    if (channel.parentId == null) {
      throw new Error("channel.parentId is null");
    }
    // クラン取得
    const clan = await DataSource.getRepository(Clan).findOneBy({
      discordCategoryId: channel.parentId,
    });
    if (clan == null) {
      throw new Error("クラン情報が取得できませんでした");
    }

    const interactionUserId = interaction.user.id;
    const clanUser = await DataSource.getRepository(User).findOne({
      where: {
        discordUserId: interactionUserId,
        clanId: clan.id,
      },
      relations: {
        reports: true,
      },
    });
    if (clanUser == null) {
      throw new Error("あなたはこのクランに所属していないよ");
    }

    const interactionChannelId = interaction.channelId;
    const boss = await DataSource.getRepository(Boss)
      .createQueryBuilder("boss")
      .where("boss.discordChannelId = :channelId", {
        channelId: interactionChannelId,
      })
      .getOne();
    if (boss == null) {
      throw new Error("ボス情報を取得できません");
    }

    const lapRepository = DataSource.getRepository(Lap);
    const lap = await lapRepository.findOneBy({
      eventId: event.id,
      clanId: clan.id,
    });
    if (lap == null) {
      throw new Error("周回数情報を取得できません");
    }
    if (!lap.isAttackPossible(boss.bossid)) {
      await interaction.reply({
        content: "このボスには凸できません",
        ephemeral: true,
      });
      return;
    }

    let bossLap = 0;

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

    const declarationFirst = new DeclarationFirst();
    const declarationFirstAsCarryOver = new DeclarationFirstAsCarryOver();
    const declarationSecond = new DeclarationSecond();
    const declarationSecondAsCarryOver = new DeclarationSecondAsCarryOver();
    const declarationThird = new DeclarationThird();
    const declarationThirdAsCarryOver = new DeclarationThirdAsCarryOver();

    const todayReports = clanUser.getTodayReports(event, dayCount);
    // なし:- 持ち越しなし:x 持ち越しあり:y 持ち越し済み:z

    if (todayReports == null || todayReports.length == 0) {
      // ---
      await interaction.reply({
        content:
          "【宣言】" +
          clanUser.name +
          "さんの " +
          bossLap +
          "周目 " +
          boss.bossid +
          "ボス 宣言だよ。",
        ephemeral: true,
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(declarationFirst.button)],
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

    if (firstAttacks.length != 0 && secondAttacks.length == 0 && thirdAttacks.length == 0) {
      if (this.isFinishedOnAttack(firstAttacks)) {
        // z--
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの " +
            bossLap +
            "周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 2凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(declarationSecond.button),
          ],
        });
      } else {
        // y--
        await interaction.reply({
          content:
            "【宣言】" +
            clanUser.name +
            "さんの " +
            bossLap +
            "周目 " +
            boss.bossid +
            "ボス 宣言だよ。",
          ephemeral: true,
          components: [
            // 1凸目の持ち越しか2凸目を選択してもらう
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              declarationFirstAsCarryOver.button,
              declarationSecond.button,
            ),
          ],
        });
      }
    }

    if (firstAttacks.length != 0 && secondAttacks.length != 0 && thirdAttacks.length == 0) {
      if (this.isFinishedOnAttack(firstAttacks)) {
        if (this.isFinishedOnAttack(secondAttacks)) {
          // zz-
          await interaction.reply({
            content:
              "【宣言】" +
              clanUser.name +
              "さんの " +
              bossLap +
              "周目 " +
              boss.bossid +
              "ボス 宣言だよ。",
            ephemeral: true,
            components: [
              // 3凸目を選択してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(declarationThird.button),
            ],
          });
        } else {
          // zy-
          await interaction.reply({
            content:
              "【宣言】" +
              clanUser.name +
              "さんの " +
              bossLap +
              "周目 " +
              boss.bossid +
              "ボス 宣言だよ。",
            ephemeral: true,
            components: [
              // 2凸目の持ち越しか3凸目を選択してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                declarationSecondAsCarryOver.button,
                declarationThird.button,
              ),
            ],
          });
        }
      } else {
        if (this.isFinishedOnAttack(secondAttacks)) {
          // yz-
          await interaction.reply({
            content:
              "【宣言】" +
              clanUser.name +
              "さんの " +
              bossLap +
              "周目 " +
              boss.bossid +
              "ボス 宣言だよ。",
            ephemeral: true,
            components: [
              // 1凸目の持ち越しか3凸目を選択してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                declarationFirstAsCarryOver.button,
                declarationThird.button,
              ),
            ],
          });
        } else {
          // yy-
          await interaction.reply({
            content:
              "【宣言】" +
              clanUser.name +
              "さんの " +
              bossLap +
              "周目 " +
              boss.bossid +
              "ボス 宣言だよ。",
            ephemeral: true,
            components: [
              // 1凸目の持ち越しか2凸目の持ち越しか3凸目を選択してもらう
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                declarationFirstAsCarryOver.button,
                declarationSecondAsCarryOver.button,
                declarationThird.button,
              ),
            ],
          });
        }
      }
    }

    if (firstAttacks.length != 0 && secondAttacks.length != 0 && thirdAttacks.length != 0) {
      if (this.isFinishedOnAttack(firstAttacks)) {
        if (this.isFinishedOnAttack(secondAttacks)) {
          if (this.isFinishedOnAttack(thirdAttacks)) {
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
                  declarationThirdAsCarryOver.button,
                ),
              ],
            });
          }
        } else {
          if (this.isFinishedOnAttack(thirdAttacks)) {
            // zyz
            await interaction.reply({
              content: "凸宣言する凸を選択してください",
              ephemeral: true,
              components: [
                // 2凸目の持ち越しを消化してもらう
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  declarationSecondAsCarryOver.button,
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
                  declarationSecondAsCarryOver.button,
                  declarationThirdAsCarryOver.button,
                ),
              ],
            });
          }
        }
      } else {
        if (this.isFinishedOnAttack(secondAttacks)) {
          if (this.isFinishedOnAttack(thirdAttacks)) {
            // yzz
            await interaction.reply({
              content: "凸宣言する凸を選択してください",
              ephemeral: true,
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  declarationFirstAsCarryOver.button,
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
                  declarationFirstAsCarryOver.button,
                  declarationThirdAsCarryOver.button,
                ),
              ],
            });
          }
        } else {
          if (this.isFinishedOnAttack(thirdAttacks)) {
            // yyz
            await interaction.reply({
              content: "凸宣言する凸を選択してください",
              ephemeral: true,
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  declarationFirstAsCarryOver.button,
                  declarationSecondAsCarryOver.button,
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
                  declarationFirstAsCarryOver.button,
                  declarationSecondAsCarryOver.button,
                  declarationThirdAsCarryOver.button,
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
  isFinishedOnAttack(attacks: Report[]): boolean {
    if (attacks.length == 2) {
      return true;
    } else if (attacks.length == 1 && attacks[0].isDefeat == false) {
      return true;
    } else {
      return false;
    }
  }
}
