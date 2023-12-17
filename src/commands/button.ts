import { ButtonInteraction } from "discord.js";

import declaration_start from "@/commands/button/declaration_start";
import { DeclarationCancel } from "@/commands/button/declaration_cancel";
import report_shave from "@/commands/button/report_shave";
import report_defeat from "@/commands/button/report_defeat";
import reload_attack_status from "@/commands/button/reload_attack_status";
import { DeclarationFirst } from "@/commands/button/DeclarationFirst";
import { DeclarationSecond } from "@/commands/button/DeclarationSecond";
import { DeclarationThird } from "@/commands/button/DeclarationThird";
import { DeclarationFirstAsCarryOver } from "@/commands/button/DeclarationFirstAsCarryOver";
import { DeclarationSecondAsCarryOver } from "@/commands/button/DeclarationSecondAsCarryOver";
import { DeclarationThirdAsCarryOver } from "@/commands/button/DeclarationThirdAsCarryOver";
import manage_menu from "@/commands/button/ManageMenu";
import reset_declaration_report from "@/commands/button/ResetDeclarationReport";
import { ResetDeclarationReportFirst } from "@/commands/button/ResetDeclarationReportFirst";
import { ResetDeclarationReportSecond } from "@/commands/button/ResetDeclarationReportSecond";
import { ResetDeclarationReportThird } from "@/commands/button/ResetDeclarationReportThird";
import edit_lap from "@/commands/button/editLap";
import editHp from "@/commands/button/editHp";

export async function action(interaction: ButtonInteraction) {
  let action = null;
  switch (interaction.customId) {
    case declaration_start.customId:
      action = declaration_start;
      break;
    case DeclarationCancel.customId:
      action = new DeclarationCancel();
      break;
    case report_shave.customId:
      action = report_shave;
      break;
    case report_defeat.customId:
      action = report_defeat;
      break;
    case reload_attack_status.customId:
      action = reload_attack_status;
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
    case manage_menu.customId:
      action = manage_menu;
      break;
    case reset_declaration_report.customId:
      action = reset_declaration_report;
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
    case edit_lap.customId:
      action = edit_lap;
      break;
    case editHp.customId:
      action = editHp;
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
