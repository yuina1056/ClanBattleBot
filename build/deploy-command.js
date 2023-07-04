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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
dotenv_1.default.config();
const hey_1 = __importDefault(require("./commands/slash/hey"));
const dice_1 = __importDefault(require("./commands/slash/dice"));
const setup_1 = __importDefault(require("./commands/slash/setup"));
// 登録コマンドを呼び出してリスト形式で登録
const commands = [
    hey_1.default.data.toJSON(),
    dice_1.default.data.toJSON(),
    setup_1.default.data.toJSON()
];
// DiscordのAPIには現在最新のversion10を指定
const rest = new rest_1.REST({ version: '10' }).setToken((_a = process.env.DISCORDAPPBOTTOKEN) !== null && _a !== void 0 ? _a : '');
// Discordサーバーにコマンドを登録
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        yield rest.put(v10_1.Routes.applicationGuildCommands((_b = process.env.DISCORDAPPLICATIONID) !== null && _b !== void 0 ? _b : '', (_c = process.env.DISCORDGUILDID) !== null && _c !== void 0 ? _c : ''), { body: commands });
        console.log('サーバー固有のコマンドが登録されました！');
    }
    catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
}))();
