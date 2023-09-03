import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild } from 'discord.js';
export const customId = 'declaration_cancel'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("取消")


export async function execute(interaction: ButtonInteraction) {
  let guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    return
  }
  const user = guild.members.cache.get(interaction.user.id)
  await interaction.reply({ content: user?.nickname + 'が凸宣言取消しました' });
}

export default {
  customId,
  data,
  execute
};
