import { ButtonBuilder, ButtonStyle, ButtonInteraction, TextBasedChannel, EmbedBuilder, ActionRowBuilder } from 'discord.js';
export const customId = 'reload_attack_status'
export const data = new ButtonBuilder()
  .setCustomId('reload_attack_status')
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況更新")

export async function execute(interaction: ButtonInteraction) {
  await interaction.message.delete()
  await sendDefaultMessage(interaction.channel!, "凸状況")
}

export async function sendDefaultMessage(channel: TextBasedChannel, channelName: string) {
  // コンポーネント定義
  const embed = new EmbedBuilder().setTitle(channelName).setColor("#00ff00").setFields(
    {
      name: '凸完了者',
      value: 'なし'
    },
    {
      name: '2凸完了者',
      value: 'なし'
    },
    {
      name: '1凸完了者',
      value: 'なし'
    },
    {
      name: '無凸',
      value: 'なし'
    },
    {
      name: '持ち越し',
      value: 'なし'
    }
  )

  if (channel?.isTextBased()) {
    await channel.send({
      embeds: [
        embed.toJSON() as any
      ],
      components: [
        new ActionRowBuilder().addComponents(data).toJSON() as any
      ]
    })
  }
}

export default {
  customId,
  data,
  execute,
  sendDefaultMessage
}
