import { ActionRowBuilder, EmbedBuilder, TextBasedChannel } from "discord.js"

import button_reload_attack_status from "../commands/button/reload_attack_status"

import User from "../entity/User"
import Event from "../entity/Event"

export async function sendMessage(channel: TextBasedChannel, users: User[], event: Event | null, isInit: boolean) {
  let userStatus: string = ''
  users.forEach(user => {
    userStatus += user.getAttackStatus(event) + '\n'
  })
  await channel.send({
    content: '```'+userStatus+'```',
    components: [
      new ActionRowBuilder().addComponents(button_reload_attack_status.data).toJSON() as any
    ]
  })

}

export default {
  sendMessage
}
