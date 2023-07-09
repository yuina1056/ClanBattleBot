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
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const declaration_1 = __importDefault(require("../button/declaration"));
const remaining_hp_1 = __importDefault(require("../button/remaining_hp"));
const magagement_setting_1 = __importDefault(require("../button/magagement_setting"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup')
    .setDescription('botを使い始める準備をします')
    .addRoleOption((option) => option.setName('ロール')
    .setDescription('作成するクランのロールを入力')
    .setRequired(true));
function execute(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let roleName;
        if (interaction.options.data[0].role != null) {
            roleName = interaction.options.data[0].role.name;
        }
        else {
            return;
        }
        let guild;
        if (interaction.guild != null) {
            guild = interaction.guild;
        }
        else {
            return;
        }
        const categoryName = 'クランバトル管理(' + roleName + ')';
        if (guild.channels.cache.find((channel) => channel.name === categoryName) != null) {
            yield interaction.reply({ content: '既にチャンネルのセットアップが完了しています', ephemeral: true });
            return;
        }
        // カテゴリ作成
        yield guild.channels.create({ name: categoryName, type: discord_js_1.ChannelType.GuildCategory });
        const categoryId = (_b = (_a = guild.channels.cache.find((channel) => channel.name === categoryName)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        // 作成したカテゴリ内にチャンネル作成
        yield createManagementChannel(guild, '凸管理', categoryId);
        yield createBossChannel(guild, roleName, '1ボス', categoryId);
        // await createBossChannel(guild, roleName, '2ボス', categoryId)
        // await createBossChannel(guild, roleName, '3ボス', categoryId)
        // await createBossChannel(guild, roleName, '4ボス', categoryId)
        // await createBossChannel(guild, roleName, '5ボス', categoryId)
        yield interaction.reply({ content: 'チャンネルを作成しました', ephemeral: true });
    });
}
exports.execute = execute;
exports.default = {
    data: exports.data,
    execute
};
// 凸管理用チャンネル作成
function createManagementChannel(guild, channelName, categoryId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield guild.channels.create({ name: channelName, parent: categoryId });
        const channelId = (_a = guild.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)) === null || _a === void 0 ? void 0 : _a.id;
        const channel = guild.channels.cache.get(channelId !== null && channelId !== void 0 ? channelId : '');
        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased()) {
            yield channel.send({
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(magagement_setting_1.default.data).toJSON()
                ]
            });
        }
    });
}
// 各ボス用チャンネル作成
function createBossChannel(guild, roleName, channelName, categoryId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield guild.channels.create({ name: channelName, parent: categoryId });
        // コンポーネント定義
        const embed = new discord_js_1.EmbedBuilder().setTitle(channelName).setColor("#00ff00").setFields({
            name: 'クラン名',
            value: roleName
        }, {
            name: '段階',
            value: "1段階目"
        }, {
            name: '周回数',
            value: "1周目"
        }, {
            name: 'HP',
            value: 'hogehoge:TODO'
        }, {
            name: '凸宣言者',
            value: 'hogehoge:TODO'
        });
        const channel = guild.channels.cache.get((_b = (_a = guild.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '');
        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased()) {
            yield channel.send({
                embeds: [
                    embed.toJSON()
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(declaration_1.default.data, remaining_hp_1.default.data).toJSON(),
                ]
            });
        }
    });
}
