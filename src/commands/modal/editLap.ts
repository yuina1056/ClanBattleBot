/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Lap from "@/entity/Lap";
import {
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const customId = "edit_lap_submit";

export async function createModal(lap: Lap): Promise<ModalBuilder> {
  const modal = new ModalBuilder().setTitle("周回数修正").setCustomId(customId);
  const ActionRowBoss1 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("1ボス周回数")
      .setCustomId("boss1_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss1Lap!.toString())
      .setRequired(true)
  );
  const ActionRowBoss2 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("2ボス周回数")
      .setCustomId("boss2_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss2Lap!.toString())
      .setRequired(true)
  );
  const ActionRowBoss3 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("3ボス周回数")
      .setCustomId("boss3_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss3Lap!.toString())
      .setRequired(true)
  );
  const ActionRowBoss4 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("4ボス周回数")
      .setCustomId("boss4_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss4Lap!.toString())
      .setRequired(true)
  );
  const ActionRowBoss5 = new ActionRowBuilder<TextInputBuilder>().setComponents(
    new TextInputBuilder()
      .setLabel("5ボス周回数")
      .setCustomId("boss5_lap")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setMinLength(1)
      .setValue(lap.boss5Lap!.toString())
      .setRequired(true)
  );

  modal.addComponents(
    ActionRowBoss1,
    ActionRowBoss2,
    ActionRowBoss3,
    ActionRowBoss4,
    ActionRowBoss5
  );
  return modal;
}

export async function submit(interaction: ModalSubmitInteraction) {
  await interaction.reply({
    content: "周回数が変更されました",
    ephemeral: true,
  });
}

export default {
  customId,
  createModal,
  submit,
};
