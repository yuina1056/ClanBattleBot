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
// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js');
// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hey')
        .setDescription('あいさつに反応してbotが返事します'),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply('Fuck.');
        });
    },
};
