import { ModalSubmitInteraction } from "discord.js";

import { ModalEditLap } from "./modal/editLap";
import { ModalReportShaveHP } from "./modal/reportShave";
import { ModalEditHp } from "./modal/editHp";

export async function action(interaction: ModalSubmitInteraction) {
  let action = null;
  switch (interaction.customId) {
    case ModalEditLap.customId:
      action = new ModalEditLap();
      break;
    case ModalReportShaveHP.customId:
      action = new ModalReportShaveHP();
      break;
    case ModalEditHp.customId:
      action = new ModalEditHp();
      break;
    default:
      console.error(`${interaction.customId}というモーダルには対応していません。`);
  }
  if (action != null) {
    try {
      await action.submit(interaction);
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
