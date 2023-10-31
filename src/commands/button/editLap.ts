import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";

export const customId = "edit_lap";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("周回数修正");

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "周回数修正ボタンが押されました",
  });
}

export default {
  customId,
  data,
  execute,
};
