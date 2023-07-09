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
exports.execute = exports.data = exports.customId = void 0;
const discord_js_1 = require("discord.js");
exports.customId = 'remainingHP';
exports.data = new discord_js_1.ButtonBuilder()
    .setCustomId(exports.customId)
    .setStyle(discord_js_1.ButtonStyle.Danger)
    .setLabel("残HP");
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.reply({ content: '残HPが表示されました', ephemeral: true });
    });
}
exports.execute = execute;
exports.default = {
    customId: exports.customId,
    data: exports.data,
    execute
};
