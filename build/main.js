"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
// hey.jsのmodule.exportsを呼び出します。
const hey = require('./commands/hey');
// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require('discord.js');
// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, () => {
    console.log(`準備OKです! ${client.user.tag}がログインします。`);
});
//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    if (!interaction.isChatInputCommand())
        return;
    switch (interaction.commandName) {
        case hey.data.name:
            // heyコマンドに対する処理
            try {
                yield hey.execute(interaction);
            }
            catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    yield interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
                else {
                    yield interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
            }
            break;
        default:
            console.error(`${interaction.commandName}というコマンドには対応していません。`);
    }
}));
// ログインします
client.login(process.env.DISCORDAPPBOTTOKEN);
