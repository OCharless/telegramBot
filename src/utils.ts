import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";
import { Context, NarrowedContext, Telegraf } from "telegraf";

export interface ICTX {
  ctx:
  | NarrowedContext<
    Context<Update> & {
      match: RegExpExecArray;
    },
    Update.CallbackQueryUpdate<CallbackQuery>
  >
  | NarrowedContext<
    Context<Update>,
    {
      message: Update.New &
      Update.NonChannel &
      Message.SuccessfulPaymentMessage;
      update_id: number;
    }
  >
}

export class UTILS {
  public Last_Message_To_Clients = new Map<number, Message>();
  public bot: Telegraf<Context<Update>> = new Telegraf("");

  constructor(_bot: Telegraf<Context<Update>>) {
    this.bot = _bot;
  }

  public static async sleep(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }

  public goBackToMain = {
    inline_keyboard: [
      [
        {
          text: "👉🏻 Main Menu 👈🏻",
          callback_data: "start",
        },
      ],
    ],
  };

  doStart = async (ctx: any, id: number) => {
    this.InitializeActions(ctx);
    let message = await this.bot.telegram.sendMessage(
      id,
      "Welcome to XXX",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Help",
                callback_data: "help",
              },
            ],
          ],
        },
      }
    );
    this.Last_Message_To_Clients.set(id, message);
  };

  doHelp = async (ctx: any, id: number) => {
    this.InitializeActions(ctx);
    let message = await this.bot.telegram.sendMessage(
      id,
      `To get information about a token you're seeking, simply paste the token contract address in this chat.\n
template of a token analysis :
token 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
Liquidity : 2.3 Liquidity locked : true ownership renounced : true
Holders : 1000
1st holder : wr of 10% 
2nd holder : wr of 5% 
3rd holder : wr of 3%
...`
      , { reply_markup: this.goBackToMain });
    this.Last_Message_To_Clients.set(id, message);
  };

  InitializeActions = async (
    ctx:
      | NarrowedContext<
        Context<Update> & {
          match: RegExpExecArray;
        },
        Update.CallbackQueryUpdate<CallbackQuery>
      >
      | NarrowedContext<
        Context<Update>,
        {
          message: Update.New &
          Update.NonChannel &
          Message.SuccessfulPaymentMessage;
          update_id: number;
        }
      >
  ) => {
    if (!ctx.chat?.id) return;
    if (ctx.callbackQuery) {
      let date = ctx.callbackQuery.message?.date;

      if (date && date * 1000 + 5000 > Date.now()) {
        ctx.answerCbQuery();
      }
    }
    let lastMessage = this.Last_Message_To_Clients.get(ctx.chat.id);

    if (lastMessage) {
      try {
        await this.bot.telegram.deleteMessage(
          ctx.chat.id,
          lastMessage.message_id
        );
      } catch (e) { }
    }
  };


  MonitorText = async (ctx: any) => {
    const id = (ctx as { chat: { id: number } }).chat.id;
    if (ctx.update.message.text === "/start") {
      this.doStart(ctx, id)
    };
    if (ctx.update.message.text === "/help") {
      this.doHelp(ctx, id)
    };
  }
}
