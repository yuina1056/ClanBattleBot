import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ActionRowBuilder,
} from "discord.js";

import button_attack_first from "./DeclarationFirst";
import button_attack_second from "./DeclarationSecond";
import button_attack_third from "./DeclarationThird";

export const customId = "declaration_start";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("凸宣言");

export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    content: "凸宣言する凸を選択してください",
    ephemeral: true,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        button_attack_first.data,
        button_attack_second.data,
        button_attack_third.data
      ),
    ],
  });
}

export default {
  customId,
  data,
  execute,
};
