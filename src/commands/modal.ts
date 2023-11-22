import { ModalSubmitInteraction } from "discord.js";
import editLap from "./modal/editLap";
import reportShave from "./modal/reportShave";

export async function action(interaction: ModalSubmitInteraction) {
  let action = null;
  switch (interaction.customId) {
    case editLap.customId:
      action = editLap;
      break;
    case reportShave.customId:
      action = reportShave;
      break;
    default:
      console.error(
        `${interaction.customId}というモーダルには対応していません。`,
      );
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
