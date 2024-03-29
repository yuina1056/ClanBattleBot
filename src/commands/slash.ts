import { ChatInputCommandInteraction } from "discord.js";

import { Dice } from "@/commands/slash/dice";
import { Setup } from "@/commands/slash/setup";
import { UpdateUser } from "@/commands/slash/updateUser";
import { ForceBossSendMessage } from "./slash/forceBossSendMessage";

export async function action(interaction: ChatInputCommandInteraction) {
  let action = null;
  switch (interaction.commandName) {
    case Dice.commandName:
      action = new Dice();
      break;
    case Setup.commandName:
      await interaction.deferReply({
        ephemeral: true,
      });
      action = new Setup();
      break;
    case UpdateUser.commandName:
      await interaction.deferReply({
        ephemeral: true,
      });
      action = new UpdateUser();
      break;
    case ForceBossSendMessage.commandName:
      await interaction.deferReply({
        ephemeral: true,
      });
      action = new ForceBossSendMessage();
      break;
    default:
      console.error(`${interaction.commandName}というコマンドには対応していません。`);
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
