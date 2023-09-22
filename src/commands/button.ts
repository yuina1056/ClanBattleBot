import { ButtonInteraction } from 'discord.js';

import declaration_start from './button/declaration_start';
import declaration_cancel from './button/declaration_cancel';
import report_shave from './button/report_shave';
import report_defeat from './button/report_defeat';
import reload_attack_status from './button/reload_attack_status';
import attack_first from './button/DeclarationFirst';
import attack_second from './button/DeclarationSecond';
import attack_third from './button/DeclarationThird';
import manage_menu from './button/ManageMenu';
import reset_declaration_report from './button/ResetDeclarationReport';
import reset_declaration_report_first from './button/ResetDeclarationReportFirst';
import reset_declaration_report_second from './button/ResetDeclarationReportSecond';
import reset_declaration_report_third from './button/ResetDeclarationReportThird';

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
    default:
      console.error(`${interaction.customId}というボタンには対応していません。`);
  }
  if (action != null) {
    try {
      await action.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'コマンド実行時にエラーになりました。[' + error + ']',
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: 'コマンドが登録されていません。管理者にお問い合わせください。',
      ephemeral: true,
    });
  }
}

export default {
  action,
};
