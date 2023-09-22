// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

import dataSource from './datasource';

dataSource.initialize();

import slash from './commands/slash';
import button from './commands/button';

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, () => {
  console.log(`準備OKです! ${client.user?.tag}がログインします。`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  // スラッシュコマンドの処理
  if (interaction.isChatInputCommand()) {
    slash.action(interaction);
  }
  // ボタンの処理
  if (interaction.isButton()) {
    button.action(interaction);
  }
});

// ログインします
client.login(process.env.DISCORDAPPBOTTOKEN);
