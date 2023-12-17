import { ButtonBuilder, ButtonStyle, ButtonInteraction, ActionRowBuilder } from "discord.js";
import { ResetDeclarationReport } from "@/commands/button/resetDeclarationReport";
import { EditLap } from "@/commands/button/editLap";
import { EditHp } from "@/commands/button/editHp";
import { Button } from "@/commands/button/button";

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
}
