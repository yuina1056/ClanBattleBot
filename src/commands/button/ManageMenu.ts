import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ActionRowBuilder,
} from "discord.js";
import button_reset_declaration_report from "./ResetDeclarationReport";

export const customId = "manage_menu";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("管理");

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "管理メニュー",
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        button_reset_declaration_report.data
      ),
    ],
  });
}

export default {
  customId,
  data,
  execute,
};
