import { SlashCommandBuilder, CommandInteraction, Guild } from "discord.js";
import { Slash } from "@/commands/slash/slash";
import { ClanRepository } from "@/repository/clanRepository";
import { UserRepository } from "@/repository/userRepository";

export class UpdateUser extends Slash {
  static readonly commandName: string = "updateuser";
  slashCommand:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  constructor() {
    super();
    this.slashCommand = new SlashCommandBuilder()
      .setName(UpdateUser.commandName)
      .setDescription("ユーザー情報を更新します")
      .addRoleOption((option) =>
        option
          .setName("ロール")
          .setDescription("ユーザー情報を更新するクランのロールを入力")
          .setRequired(true),
      );
  }

  async execute(interaction: CommandInteraction) {
    let roleId: string;
    let roleName: string;
    if (interaction.options.data[0].role != null) {
      roleId = interaction.options.data[0].role.id;
      roleName = interaction.options.data[0].role.name;
    } else {
      throw new Error("role is null");
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
    const users = await new UserRepository().getUsersByClanId(clan.id ?? 0);
    await new UserRepository().deleteByClanId(clan.id ?? 0);

    await interaction.guild.members.fetch();
    const role = await guild.roles.fetch(roleId);
    const guildMembers = await role?.members;
    if (guildMembers != null) {
      if (guildMembers.size > 30) {
        throw new Error(
          "メンバー数が30人を超えています。ロール設定を見直しして再実行してください。",
        );
      }
      guildMembers.forEach(async (guildMember) => {
        let userName = "";
        // 名前の取得優先度： サーバーニックネーム > discordネーム > ユーザーID
        if (guildMember.nickname != null) {
          userName = guildMember.nickname;
        } else if (guildMember.user.globalName != null) {
          userName = guildMember.user.globalName;
        } else {
          userName = guildMember.user.username;
        }
        const user = users.find((user) => user.discordUserId === guildMember.user.id);
        if (user != null) {
          user.name = userName;
          await new UserRepository().restoreByUserId(user.id ?? 0);
          await new UserRepository().save(user);
        } else {
          await new UserRepository().create(guildMember.user.id, userName, clan.id ?? 0);
        }
      });
    }

    await interaction.followUp("クランロール[" + roleName + "]のユーザー情報を更新しました");
  }
}
