from dotenv import load_dotenv

load_dotenv()

import asyncio
import base64
import logging
import os
import redis.asyncio as redis
from telegram import Update, Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Updater,
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    CallbackQueryHandler,
    filters,
)
import yaml

NEW_ENCOUNTERS_CHANNEL_NAME = "newEncounters"
APPROACH_OPTION = "approach"
IGNORE_OPTION = "ignore"

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = int(os.environ["REDIS_PORT"])
TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
DIALOGUE_PATH = os.environ["DIALOGUE_PATH"]

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)


def load_dialogue():
    with open(DIALOGUE_PATH) as f:
        return yaml.safe_load(f)


dialogue = load_dialogue()

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


def make_user_key(address):
    return f"user:{address}"


def make_chat_secret_key(chat_secret):
    return f"userChatSecret:{chat_secret}"


async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(
        chat_id=update.effective_chat.id, text=dialogue["unknown"]
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_secret = context.args[0]
    chat_secret_key = make_chat_secret_key(chat_secret)
    address = await r.hget(chat_secret_key, "address")

    if not address:
        await update.message.reply_text(text=dialogue["invalid_chat_secret"])
        return

    user_key = make_user_key(address)
    await r.hset(user_key, "chatId", str(update.message.chat_id))

    await update.message.reply_text(text=dialogue["welcome"])


async def button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Parses the CallbackQuery and updates the message text."""
    query = update.callback_query
    await query.answer()
    # await query.edit_message_text(text=f"Selected option: {query.data}")
    await query.delete_message()
    # await update.message.reply_text("test")


async def run_bot():
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.COMMAND, unknown))
    app.add_handler(CallbackQueryHandler(button))

    # try:
    try:
        await app.initialize()
        await app.updater.start_polling()
        await app.start()
        await asyncio.Event().wait()
    finally:
        await app.updater.stop()
        await app.stop()
        await app.shutdown()


async def listen_redis():
    pubsub = r.pubsub()
    bot = Bot(TELEGRAM_BOT_TOKEN)

    # Subscribe to a channel (or multiple channels)
    await pubsub.subscribe(NEW_ENCOUNTERS_CHANNEL_NAME)

    # Listen for messages
    async with r.pubsub() as pubsub:
        await pubsub.subscribe(NEW_ENCOUNTERS_CHANNEL_NAME)

        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message is not None:
                await handle_redis_message(bot, message)


async def handle_redis_message(bot, message):
    if message["channel"] == NEW_ENCOUNTERS_CHANNEL_NAME:
        await handle_new_encounter(bot, message["data"])
    else:
        logging.warn("received redis message on unexpected channel")


async def handle_new_encounter(bot, encounter_key):
    encounter = await r.hgetall(encounter_key)
    print(encounter)
    # user = await r.hgetall(encounter["user"])
    # chat_id = int(user["chatid"])
    chat_id = 3227118
    keyboard = [
        [
            InlineKeyboardButton("Approach", callback_data=APPROACH_OPTION),
            InlineKeyboardButton("Ignore", callback_data=IGNORE_OPTION),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await bot.send_message(
        chat_id,
        dialogue["encounter"],
        reply_markup=reply_markup.to_dict(),
    )


async def main():
    await asyncio.gather(run_bot(), listen_redis())


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
