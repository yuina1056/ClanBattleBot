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
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup')
    .setDescription('botを使い始める準備をします');
function execute(interaction) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const guild = interaction.guild;
        yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({ name: 'クランバトル管理', type: discord_js_1.ChannelType.GuildCategory }));
        const categoryId = (_a = guild === null || guild === void 0 ? void 0 : guild.channels.cache.find((channel) => channel.name === 'クランバトル管理')) === null || _a === void 0 ? void 0 : _a.id;
        yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({ name: '凸管理', parent: categoryId }));
        yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.create({ name: '1ボス', parent: categoryId }));
        yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.create({ name: '2ボス', parent: categoryId }));
        yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.create({ name: '3ボス', parent: categoryId }));
        yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.channels.create({ name: '4ボス', parent: categoryId }));
        yield ((_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.channels.create({ name: '5ボス', parent: categoryId }));
        yield interaction.reply('チャンネルを作成しました');
    });
}
exports.execute = execute;
exports.default = {
    data: exports.data,
    execute
};
