require('dotenv').config();

// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');

// hey.jsのmodule.exportsを呼び出します。
const heyFile = require('./commands/hey.js');

// 登録コマンドを呼び出してリスト形式で登録
const commands = [heyFile.data.toJSON()];

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(process.env.DISCORDAPPBOTTOKEN);

// Discordサーバーにコマンドを登録
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORDAPPLICATIONID, process.env.DISCORDGUILDID),
      { body: commands },
    );
    console.log('サーバー固有のコマンドが登録されました！');
  } catch (error) {
    console.error('コマンドの登録中にエラーが発生しました:', error);
  }
})();
