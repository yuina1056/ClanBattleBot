import { ActionRowBuilder, EmbedBuilder, TextBasedChannel } from "discord.js"

import button_reload_attack_status from "../commands/button/reload_attack_status"

export async function sendMessage(channel: TextBasedChannel, isInit: boolean) {
  // コンポーネント定義
  const embed = new EmbedBuilder().setTitle("凸状況").setColor("#00ff00").setFields(
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

  await channel.send({
    embeds: [
      embed.toJSON() as any
    ],
    components: [
      new ActionRowBuilder().addComponents(button_reload_attack_status.data).toJSON() as any
    ]
  })

}

export default {
  sendMessage
}
