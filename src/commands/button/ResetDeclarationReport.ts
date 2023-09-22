import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from 'discord.js';

export const customId = 'reset_declaration_report';
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel('凸状況リセット');

import button_reset_declaration_report_first from './resetDeclarationReportFirst';
import button_reset_declaration_report_second from './resetDeclarationReportSecond';
import button_reset_declaration_report_third from './resetDeclarationReportThird';

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: 'どの凸をリセットしますか？(ボタンを押したらリセット処理が行われます)',
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        button_reset_declaration_report_first.data,
        button_reset_declaration_report_second.data,
        button_reset_declaration_report_third.data
      ),
    ],
  });
}

export default {
  customId,
  data,
  execute,
};
