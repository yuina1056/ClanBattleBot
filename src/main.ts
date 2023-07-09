// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// default exportsのインポート
import hey from './commands/slash/hey';
import dice from './commands/slash/dice';
import setup from './commands/slash/setup';
import declaration from './commands/button/declaration';
import remainingHP from './commands/button/remaining_hp';
import magagement_setting from './commands/button/magagement_setting';

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, () => {
  console.log(`準備OKです! ${client.user?.tag}がログインします。`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  // スラッシュコマンドの処理
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case hey.data.name:
        // heyコマンドに対する処理
        try {
          await hey.execute(interaction);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          }
        }
        break;
      case dice.data.name:
        // diceコマンドに対する処理
        try {
          await dice.execute(interaction);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          }
        }
        break;
      case setup.data.name:
        // setupコマンドに対する処理
        try {
          await setup.execute(interaction);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
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
      case declaration.customId:
        try {
          await declaration.execute(interaction);
        } catch (error) {
          await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
        break;
      case remainingHP.customId:
        try {
          await remainingHP.execute(interaction);
        } catch (error) {
          await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
        break;
      case magagement_setting.customId:
        try {
          await magagement_setting.execute(interaction);
        } catch (error) {
          await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
        break;
      default:
        console.error(`${interaction.customId}というボタンには対応していません。`);
    }
  }
});

// ログインします
client.login(process.env.DISCORDAPPBOTTOKEN);
