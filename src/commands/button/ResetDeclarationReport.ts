import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";

export const customId = "reset_declaration_report";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況リセット");

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    content: "凸状況をリセットしました",
    ephemeral: true,
  });
}

export default {
  customId,
  data,
  execute,
};
