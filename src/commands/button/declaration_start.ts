import { ButtonBuilder, ButtonStyle, ButtonInteraction, Guild, ActionRowBuilder } from 'discord.js';
import dayjs from 'dayjs';

import DataSource from '../../datasource';
import User from '../../entity/User';
import Boss from '../../entity/Boss';
import Declaration from '../../entity/Declaration';
import Event from '../../entity/Event';

import button_attack_first from './DeclarationFirst'
import button_attack_second from './DeclarationSecond'
import button_attack_third from './DeclarationThird'

export const customId = 'declaration_start'
export const data = new ButtonBuilder()
  .setCustomId(customId)
  .setStyle(ButtonStyle.Primary)
  .setLabel("凸宣言")


export async function execute(interaction: ButtonInteraction) {
  await interaction.reply({
    content: '凸宣言する凸を選択してください',
    ephemeral: true,
    components: [
      new ActionRowBuilder().addComponents(
        button_attack_first.data,
        button_attack_second.data,
        button_attack_third.data,
      ).toJSON() as any,
    ]
  });
}

export default {
  customId,
  data,
  execute
};
