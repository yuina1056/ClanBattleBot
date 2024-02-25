import { Slash } from "@/commands/slash/slash";
import BossChannelMessage from "@/messages/BossChannelMessage";
import { BossRepository } from "@/repository/bossRepository";
import { ClanEventRepository } from "@/repository/clanEventRepository";
import { ClanRepository } from "@/repository/clanRepository";
import { DeclarationRepository } from "@/repository/declarationRepository";
import { EventRepository } from "@/repository/eventRepository";
import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";

export class ForceBossSendMessage extends Slash {
  static readonly commandName: string = "forcesendmessage";
  slashCommand:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  constructor() {
    super();
    this.slashCommand = new SlashCommandBuilder()
      .setName(ForceBossSendMessage.commandName)
      .setDescription("各ボス入力用メッセージ強制送信")
      .addRoleOption((option) =>
        option.setName("ロール").setDescription("送信するクランのロールを入力").setRequired(true),
      )
      .addIntegerOption((option) =>
        option.setName("ボス番号").setDescription("ボス番号を入力").setRequired(true),
      );
  }

  async execute(interaction: CommandInteraction) {
    let roleId: string;
    let roleName: string;
    let BossNo: number;
    if (interaction.options.data[0].role != null) {
      roleId = interaction.options.data[0].role.id;
      roleName = interaction.options.data[0].role.name;
    } else {
      throw new Error("role is null");
    }
    if (interaction.options.data[1].value != null) {
      if (typeof interaction.options.data[1].value === "number") {
        BossNo = interaction.options.data[1].value;
      } else {
        throw new Error("value is not number");
      }
    } else {
      throw new Error("value is null");
    }
    if (BossNo < 1 || BossNo > 5) {
      throw new Error("ボス番号は1~5の間で入力してください");
    }

    let guild: Guild;
    if (interaction.guild != null) {
      guild = interaction.guild;
    } else {
      throw new Error("interaction.guild is null");
    }
    const clan = await new ClanRepository().getClanByDiscordRoleId(roleId);
    if (clan == null) {
      throw new Error("clan is null");
    }
    if (clan.id == null) {
      throw new Error("clan.id is null");
    }
    const boss = await new BossRepository().getByClanIdAndBossNo(clan.id, BossNo);
    if (boss == null) {
      throw new Error("boss is null");
    }
    const event = await new EventRepository().findEventByToday();
    if (event == null) {
      throw new Error("event is null");
    }
    if (event.id == null) {
      throw new Error("event.id is null");
    }
    const clanEvent = await new ClanEventRepository().getClanEventByClanIdAndEventId(
      clan.id,
      event.id,
    );
    if (clanEvent == null) {
      throw new Error("clanEvent is null");
    }
    const declarations =
      await new DeclarationRepository().getDeclarationsByClanIdAndBossNoAndIsFinishedToRelationUser(
        clan.id,
        boss.bossNo,
        false,
      );
    const channel = guild.channels.client.channels.cache.get(boss.discordChannelId);
    if (channel == null) {
      throw new Error("channel is null");
    }
    if (channel.isTextBased()) {
      await BossChannelMessage.sendMessage(channel, clan, boss, clanEvent, declarations);
    }
    await interaction.followUp({
      content: `${roleName}の${BossNo}ボス入力用メッセージを強制送信しました`,
      ephemeral: true,
    });
  }
}
