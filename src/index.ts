import { Context, Telegraf } from "telegraf";
import { UTILS } from "./utils";
import { Update } from "telegraf/typings/core/types/typegram";
import { config } from "dotenv";

config();

export class TelegramBotInterface {
  public bot = new Telegraf("");
  public utils: UTILS;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_ID || "");
    this.utils = new UTILS(this.bot);
  }

  public initBot(): Telegraf<Context<Update>> {

    this.bot.on('text', async (ctx) => {
      this.utils.MonitorText(ctx);
    });

    this.bot.action("help", async (ctx) => {
      if (!ctx.chat?.id) return;
      this.utils.doHelp(ctx, ctx.chat?.id);
    });

    this.bot.action("start", async (ctx) => {
      if (!ctx.chat?.id) return;
      return await this.utils.doStart(ctx, ctx.chat.id);

    });

    this.bot.launch();
    return this.bot;
  }


}

let test = true;
let instance = new TelegramBotInterface();
instance.initBot();
