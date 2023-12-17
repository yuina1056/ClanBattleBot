import { ButtonInteraction } from "discord.js";

import { DeclarationStart } from "@/commands/button/declaration_start";
import { DeclarationCancel } from "@/commands/button/declaration_cancel";
import { ReportShave } from "@/commands/button/report_shave";
import { ReportDefeat } from "@/commands/button/report_defeat";
import { ReloadAttackStatus } from "@/commands/button/reload_attack_status";
import { DeclarationFirst } from "@/commands/button/DeclarationFirst";
import { DeclarationSecond } from "@/commands/button/DeclarationSecond";
import { DeclarationThird } from "@/commands/button/DeclarationThird";
import { DeclarationFirstAsCarryOver } from "@/commands/button/DeclarationFirstAsCarryOver";
import { DeclarationSecondAsCarryOver } from "@/commands/button/DeclarationSecondAsCarryOver";
import { DeclarationThirdAsCarryOver } from "@/commands/button/DeclarationThirdAsCarryOver";
import { ManageMenu } from "@/commands/button/ManageMenu";
import { ResetDeclarationReport } from "@/commands/button/ResetDeclarationReport";
import { ResetDeclarationReportFirst } from "@/commands/button/ResetDeclarationReportFirst";
import { ResetDeclarationReportSecond } from "@/commands/button/ResetDeclarationReportSecond";
import { ResetDeclarationReportThird } from "@/commands/button/ResetDeclarationReportThird";
import { EditLap } from "@/commands/button/editLap";
import { EditHp } from "@/commands/button/editHp";

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
