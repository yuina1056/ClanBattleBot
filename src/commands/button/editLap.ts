import {
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from "discord.js";

export const customId = "edit_lap";
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("周回数修正");

export async function execute(interaction: ButtonInteraction) {
  const modal = new ModalBuilder()
    .setTitle("周回数修正")
    .setCustomId("edit_lap_submit");
  const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("1ボス周回数")
      .setCustomId("boss1_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue("1")
      .setRequired(true)
  );
  const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("2ボス周回数")
      .setCustomId("boss2_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue("1")
      .setRequired(true)
  );
  const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("3ボス周回数")
      .setCustomId("boss3_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue("1")
      .setRequired(true)
  );
  const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("4ボス周回数")
      .setCustomId("boss4_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue("1")
      .setRequired(true)
  );
  const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("5ボス周回数")
      .setCustomId("boss5_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue("1")
      .setRequired(true)
  );

  modal.addComponents(
    ActionRowBoss1,
    ActionRowBoss2,
    ActionRowBoss3,
    ActionRowBoss4,
    ActionRowBoss5
  );
  await interaction.showModal(modal);
}

export default {
  customId,
  data,
  execute,
};
