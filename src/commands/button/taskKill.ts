import { Button } from "@/commands/button/button";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export class TaskKill extends Button {
  static readonly customId = "task_kill";
  button: ButtonBuilder;

  constructor() {
    super();
    this.button = new ButtonBuilder()
      .setCustomId(TaskKill.customId)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("タスクキル");
  }

  async execute() {
    console.log("TaskKill");
  }
}
