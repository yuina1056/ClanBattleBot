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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// default exportsのインポート
const hey_1 = __importDefault(require("./commands/slash/hey"));
const dice_1 = __importDefault(require("./commands/slash/dice"));
const setup_1 = __importDefault(require("./commands/slash/setup"));
const declaration_1 = __importDefault(require("./commands/button/declaration"));
const remaining_hp_1 = __importDefault(require("./commands/button/remaining_hp"));
const magagement_setting_1 = __importDefault(require("./commands/button/magagement_setting"));
// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers] });
// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`準備OKです! ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}がログインします。`);
});
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // スラッシュコマンドの処理
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case hey_1.default.data.name:
                // heyコマンドに対する処理
                try {
                    yield hey_1.default.execute(interaction);
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
            case dice_1.default.data.name:
                // diceコマンドに対する処理
                try {
                    yield dice_1.default.execute(interaction);
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
            case setup_1.default.data.name:
                // setupコマンドに対する処理
                try {
                    yield setup_1.default.execute(interaction);
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
    }
    // ボタンの処理
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case declaration_1.default.customId:
                try {
                    yield declaration_1.default.execute(interaction);
                }
                catch (error) {
                    yield interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
                break;
            case remaining_hp_1.default.customId:
                try {
                    yield remaining_hp_1.default.execute(interaction);
                }
                catch (error) {
                    yield interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
                break;
            case magagement_setting_1.default.customId:
                try {
                    yield magagement_setting_1.default.execute(interaction);
                }
                catch (error) {
                    yield interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
                }
                break;
            default:
                console.error(`${interaction.customId}というボタンには対応していません。`);
        }
    }
}));
// ログインします
client.login(process.env.DISCORDAPPBOTTOKEN);
