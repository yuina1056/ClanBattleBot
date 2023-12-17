import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from "discord.js";
import { ResetDeclarationReport } from "@/commands/button/ResetDeclarationReport";
import { EditLap } from "@/commands/button/editLap";
import { EditHp } from "@/commands/button/editHp";

export const customId = "manage_menu";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("管理");

export async function execute(interaction: ButtonInteraction) {
  const editHp = new EditHp();
  const editLap = new EditLap();
  const resetDeclarationReport = new ResetDeclarationReport();
  await interaction.reply({
    ephemeral: true,
    content: "管理メニュー",
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        resetDeclarationReport.button,
        editLap.button,
        editHp.button,
      ),
    ],
  });
}

export default {
  customId,
  data,
  execute,
};
