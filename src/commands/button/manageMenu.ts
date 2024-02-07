import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from "discord.js";
import { ResetDeclarationReport } from "@/commands/button/resetDeclarationReport";
import { EditLap } from "@/commands/button/editLap";
import { EditHp } from "@/commands/button/editHp";
import { Button } from "@/commands/button/button";
import { FixReport } from "./fixReport";

export class ManageMenu extends Button {
  static readonly customId = "manage_menu";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(ManageMenu.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("管理");
  }

  async execute(interaction: ButtonInteraction) {
    await interaction.reply({
      ephemeral: true,
      content: "管理メニュー",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ResetDeclarationReport().button,
          new EditLap().button,
          new EditHp().button,
          new FixReport().button,
        ),
      ],
    });
  }
}
