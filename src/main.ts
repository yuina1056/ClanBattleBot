// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// default exportsのインポート
import dice from './commands/slash/dice';
import setup from './commands/slash/setup';
import declaration from './commands/button/declaration_start';
import remainingHP from './commands/button/remaining_hp';
import magagement_setting from './commands/button/magagement_setting';
import report_shave from './commands/button/report_shave';
import report_defeat from './commands/button/report_defeat';
import declaration_cancel from './commands/button/declaration_cancel';

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
      case declaration_cancel.customId:
        try {
          await declaration_cancel.execute(interaction);
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
      case report_shave.customId:
        try {
          await report_shave.execute(interaction);
        } catch (error) {
          await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
        break;
      case report_defeat.customId:
        try {
          await report_defeat.execute(interaction);
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
