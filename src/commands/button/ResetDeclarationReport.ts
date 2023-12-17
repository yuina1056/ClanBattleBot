import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from "discord.js";

export const customId = "reset_declaration_report";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況リセット");

import { ResetDeclarationReportFirst } from "@/commands/button/ResetDeclarationReportFirst";
import { ResetDeclarationReportSecond } from "@/commands/button/ResetDeclarationReportSecond";
import { ResetDeclarationReportThird } from "@/commands/button/ResetDeclarationReportThird";

export async function execute(interaction: ButtonInteraction) {
  const resetDeclarationReportFirst = new ResetDeclarationReportFirst();
  const resetDeclarationReportSecond = new ResetDeclarationReportSecond();
  const resetDeclarationReportThird = new ResetDeclarationReportThird();

  await interaction.reply({
    ephemeral: true,
    content: "どの凸をリセットしますか？(ボタンを押したらリセット処理が行われます)",
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        resetDeclarationReportFirst.button,
        resetDeclarationReportSecond.button,
        resetDeclarationReportThird.button,
      ),
    ],
  });
}

export default {
  customId,
  data,
  execute,
};
