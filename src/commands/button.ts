import { ButtonInteraction } from "discord.js";

import { DeclarationStart } from "@/commands/button/declarationStart";
import { DeclarationCancel } from "@/commands/button/declarationCancel";
import { ReportShave } from "@/commands/button/reportShave";
import { ReportDefeat } from "@/commands/button/reportDefeat";
import { ReloadAttackStatus } from "@/commands/button/reloadAttackStatus";
import { DeclarationFirst } from "@/commands/button/declarationFirst";
import { DeclarationSecond } from "@/commands/button/declarationSecond";
import { DeclarationThird } from "@/commands/button/declarationThird";
import { DeclarationFirstAsCarryOver } from "@/commands/button/declarationFirstAsCarryOver";
import { DeclarationSecondAsCarryOver } from "@/commands/button/declarationSecondAsCarryOver";
import { DeclarationThirdAsCarryOver } from "@/commands/button/declarationThirdAsCarryOver";
import { ManageMenu } from "@/commands/button/manageMenu";
import { ResetDeclarationReport } from "@/commands/button/resetDeclarationReport";
import { ResetDeclarationReportFirst } from "@/commands/button/resetDeclarationReportFirst";
import { ResetDeclarationReportSecond } from "@/commands/button/resetDeclarationReportSecond";
import { ResetDeclarationReportThird } from "@/commands/button/resetDeclarationReportThird";
import { EditLap } from "@/commands/button/editLap";
import { EditHp } from "@/commands/button/editHp";
import { Relief } from "@/commands/button/relief";
import { SupportBoss } from "@/commands/button/supportBoss";
import { TaskKill } from "@/commands/button/taskKill";

export async function action(interaction: ButtonInteraction) {
  let action = null;
  switch (interaction.customId) {
    case DeclarationStart.customId:
      action = new DeclarationStart();
      break;
    case DeclarationCancel.customId:
      action = new DeclarationCancel();
      break;
    case ReportShave.customId:
      action = new ReportShave();
      break;
    case ReportDefeat.customId:
      action = new ReportDefeat();
      break;
    case ReloadAttackStatus.customId:
      action = new ReloadAttackStatus();
      break;
    case DeclarationFirst.customId:
      action = new DeclarationFirst();
      break;
    case DeclarationSecond.customId:
      action = new DeclarationSecond();
      break;
    case DeclarationThird.customId:
      action = new DeclarationThird();
      break;
    case DeclarationFirstAsCarryOver.customId:
      action = new DeclarationFirstAsCarryOver();
      break;
    case DeclarationSecondAsCarryOver.customId:
      action = new DeclarationSecondAsCarryOver();
      break;
    case DeclarationThirdAsCarryOver.customId:
      action = new DeclarationThirdAsCarryOver();
      break;
    case ManageMenu.customId:
      action = new ManageMenu();
      break;
    case ResetDeclarationReport.customId:
      action = new ResetDeclarationReport();
      break;
    case ResetDeclarationReportFirst.customId:
      action = new ResetDeclarationReportFirst();
      break;
    case ResetDeclarationReportSecond.customId:
      action = new ResetDeclarationReportSecond();
      break;
    case ResetDeclarationReportThird.customId:
      action = new ResetDeclarationReportThird();
      break;
    case EditLap.customId:
      action = new EditLap();
      break;
    case EditHp.customId:
      action = new EditHp();
      break;
    case Relief.customId:
      action = new Relief();
      break;
    case SupportBoss.customId:
      action = new SupportBoss();
      break;
    case TaskKill.customId:
      action = new TaskKill();
      break;
    default:
      console.error(`${interaction.customId}というボタンには対応していません。`);
  }
  if (action != null) {
    try {
      await action.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "コマンド実行時にエラーになりました。[" + error + "]",
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: "コマンドが登録されていません。管理者にお問い合わせください。",
      ephemeral: true,
    });
  }
}

export default {
  action,
};
