import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';

dotenv.config();

const heyFile = require('./commands/hey');
const diceFile = require('./commands/dice');

// 登録コマンドを呼び出してリスト形式で登録
const commands = [
  heyFile.data.toJSON(),
  diceFile.data.toJSON()
];

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(process.env.DISCORDAPPBOTTOKEN ?? "");

// Discordサーバーにコマンドを登録
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORDAPPLICATIONID ?? "", process.env.DISCORDGUILDID ?? ""),
      { body: commands },
    );
    console.log('サーバー固有のコマンドが登録されました！');
  } catch (error) {
    console.error('コマンドの登録中にエラーが発生しました:', error);
  }
})();
