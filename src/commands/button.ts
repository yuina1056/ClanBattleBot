import { ButtonInteraction } from "discord.js";

import declaration_start from "@/commands/button/declaration_start";
import declaration_cancel from "@/commands/button/declaration_cancel";
import report_shave from "@/commands/button/report_shave";
import report_defeat from "@/commands/button/report_defeat";
import reload_attack_status from "@/commands/button/reload_attack_status";
import attack_first from "@/commands/button/DeclarationFirst";
import attack_second from "@/commands/button/DeclarationSecond";
import attack_third from "@/commands/button/DeclarationThird";
import attackFirstAsCarryOver from "@/commands/button/DeclarationFirstAsCarryOver";
import attackSecondAsCarryOver from "@/commands/button/DeclarationSecondAsCarryOver";
import attackThirdAsCarryOver from "@/commands/button/DeclarationThirdAsCarryOver";
import manage_menu from "@/commands/button/ManageMenu";
import reset_declaration_report from "@/commands/button/ResetDeclarationReport";
import reset_declaration_report_first from "@/commands/button/ResetDeclarationReportFirst";
import reset_declaration_report_second from "@/commands/button/ResetDeclarationReportSecond";
import reset_declaration_report_third from "@/commands/button/ResetDeclarationReportThird";
import edit_lap from "@/commands/button/editLap";

export async function action(interaction: ButtonInteraction) {
  let action = null;
  switch (interaction.customId) {
    case declaration_start.customId:
      action = declaration_start;
      break;
    case declaration_cancel.customId:
      action = declaration_cancel;
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
    case attack_first.customId:
      action = attack_first;
      break;
    case attack_second.customId:
      action = attack_second;
      break;
    case attack_third.customId:
      action = attack_third;
      break;
    case attackFirstAsCarryOver.customId:
      action = attackFirstAsCarryOver;
      break;
    case attackSecondAsCarryOver.customId:
      action = attackSecondAsCarryOver;
      break;
    case attackThirdAsCarryOver.customId:
      action = attackThirdAsCarryOver;
      break;
    case manage_menu.customId:
      action = manage_menu;
      break;
    case reset_declaration_report.customId:
      action = reset_declaration_report;
      break;
    case reset_declaration_report_first.customId:
      action = reset_declaration_report_first;
      break;
    case reset_declaration_report_second.customId:
      action = reset_declaration_report_second;
      break;
    case reset_declaration_report_third.customId:
      action = reset_declaration_report_third;
      break;
    case edit_lap.customId:
      action = edit_lap;
      break;
    default:
      console.error(
        `${interaction.customId}というボタンには対応していません。`,
      );
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
