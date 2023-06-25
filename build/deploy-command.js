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
require('dotenv').config();
// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');
// hey.jsのmodule.exportsを呼び出します。
const heyFile = require('./commands/hey');
// 登録コマンドを呼び出してリスト形式で登録
const commands = [heyFile.data.toJSON()];
// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(process.env.DISCORDAPPBOTTOKEN);
// Discordサーバーにコマンドを登録
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rest.put(Routes.applicationGuildCommands(process.env.DISCORDAPPLICATIONID, process.env.DISCORDGUILDID), { body: commands });
        console.log('サーバー固有のコマンドが登録されました！');
    }
    catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
}))();
