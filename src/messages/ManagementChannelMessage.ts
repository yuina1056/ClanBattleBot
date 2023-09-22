import { ActionRowBuilder, Message, TextBasedChannel, ButtonBuilder } from 'discord.js';

import button_reload_attack_status from '../commands/button/reload_attack_status';
import button_manage_menu from '../commands/button/ManageMenu';

import User from '../entity/user';
import Event from '../entity/event';

export async function sendMessage(
  channel: TextBasedChannel,
  message: Message | null,
  users: User[],
  event: Event | null,
  isInit: boolean
) {
  let userStatus = '';
  users.forEach((user) => {
    userStatus += user.getAttackStatus(event) + '\n';
  });
  const content: string = '```' + userStatus + '```';
  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      button_reload_attack_status.data,
      button_manage_menu.data
    ),
  ];
  if (isInit) {
    await channel.send({
      content: content,
      components: components,
    });
  } else {
    if (message != null) {
      await message.edit({
        content: content,
        components: components,
      });
    }
  }
}

export default {
  sendMessage,
};
