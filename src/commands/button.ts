import { ButtonInteraction } from 'discord.js';

import declaration_start from './button/declaration_start';
import declaration_cancel from './button/declaration_cancel';
import report_shave from './button/report_shave';
import report_defeat from './button/report_defeat';
import reload_attack_status from './button/reload_attack_status';
import attack_first from './button/DeclarationFirst';
import attack_second from './button/DeclarationSecond';
import attack_third from './button/DeclarationThird';

export async function action(interaction: ButtonInteraction) {
  let action: any = null
  switch (interaction.customId) {
    case declaration_start.customId:
      action = declaration_start
      break;
    case declaration_cancel.customId:
      action = declaration_cancel
      break;
    case report_shave.customId:
      action = report_shave
      break;
    case report_defeat.customId:
      action = report_defeat
      break;
    case reload_attack_status.customId:
      action = reload_attack_status
      break;
    case attack_first.customId:
      action = attack_first
      break;
    case attack_second.customId:
      action = attack_second
      break;
    case attack_third.customId:
      action = attack_third
      break;
    default:
      console.error(`${interaction.customId}というボタンには対応していません。`);
  }
  if (action != null) {
    try {
      await action.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
    }
  } else {
    await interaction.reply({ content: 'コマンドが登録されていません。', ephemeral: true });
  }
}

export default {
  action
};
