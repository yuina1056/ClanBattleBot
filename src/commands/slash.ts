import { ChatInputCommandInteraction } from "discord.js";
import dice from "./slash/dice";
import setup from "./slash/setup";

export async function action(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });
  let action = null;
  switch (interaction.commandName) {
    case dice.data.name:
      action = dice;
      break;
    case setup.data.name:
      action = setup;
      break;
    default:
      console.error(
        `${interaction.commandName}というコマンドには対応していません。`
      );
  }
  if (action != null) {
    try {
      await action.execute(interaction);
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "コマンド実行時にエラーになりました。[" + error + "]",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "コマンド実行時にエラーになりました。[" + error + "]",
          ephemeral: true,
        });
      }
    }
  } else {
    await interaction.reply({
      content: "コマンドが登録されていません。",
      ephemeral: true,
    });
  }
}

export default {
  action,
};
