import { ChatInputCommandInteraction } from "discord.js";
import dice from "@/commands/slash/dice";
import setup from "@/commands/slash/setup";
import updateUser from "@/commands/slash/UpdateUser";

export async function action(interaction: ChatInputCommandInteraction) {
  let action = null;
  switch (interaction.commandName) {
    case dice.data.name:
      action = dice;
      break;
    case setup.data.name:
      await interaction.deferReply({
        ephemeral: true,
      });
      action = setup;
      break;
    case updateUser.data.name:
      await interaction.deferReply({
        ephemeral: true,
      });
      action = updateUser;
      break;
    default:
      console.error(
        `${interaction.commandName}というコマンドには対応していません。`,
      );
  }
  if (action != null) {
    try {
      await action.execute(interaction);
    } catch (error) {
      await interaction.followUp({
        content: "コマンド実行時にエラーになりました。[" + error + "]",
        ephemeral: true,
      });
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
