// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
import { Client, Events, GatewayIntentBits, Interaction } from "discord.js";
import dotenv from "dotenv";

import DataSource from "@/repository/datasource";
import slash from "@/commands/slash";
import button from "@/commands/button";
import modal from "@/commands/modal";

// 初期化処理
dotenv.config();
DataSource.initialize();

// クライアント生成
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
  // モーダルの処理
  if (interaction.isModalSubmit()) {
    modal.action(interaction);
  }
});

// ログインします
client.login(process.env.DISCORDAPPBOTTOKEN);
