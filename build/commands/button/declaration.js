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
exports.execute = void 0;
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let guild;
        if (interaction.guild != null) {
            guild = interaction.guild;
        }
        else {
            return;
        }
        const user = guild.members.cache.get(interaction.user.id);
        yield interaction.reply({ content: (user === null || user === void 0 ? void 0 : user.nickname) + 'が凸宣言しました' });
    });
}
exports.execute = execute;
exports.default = {
    execute
};
