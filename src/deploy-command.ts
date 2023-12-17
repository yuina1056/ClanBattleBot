import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

dotenv.config();

import { Dice } from "@/commands/slash/dice";
import { Setup } from "@/commands/slash/setup";
import { UpdateUser } from "@/commands/slash/UpdateUser";

// 登録コマンドを呼び出してリスト形式で登録
const dice = new Dice();
const setup = new Setup();
const updateUser = new UpdateUser();
const commands = [
  dice.slashCommand.toJSON(),
  setup.slashCommand.toJSON(),
  updateUser.slashCommand.toJSON(),
];

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: "10" }).setToken(process.env.DISCORDAPPBOTTOKEN ?? "");

// Discordサーバーにコマンドを登録
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORDAPPLICATIONID ?? "",
        process.env.DISCORDGUILDID ?? "",
      ),
      { body: commands },
    );
    console.log("サーバー固有のコマンドが登録されました！");
  } catch (error) {
    console.error("コマンドの登録中にエラーが発生しました:", error);
  }
})();
