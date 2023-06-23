const TelegramBot = require("node-telegram-bot-api");

const tele = (payload, bot) => {
  return new Promise((resolve, reject) => {
    const opts = {
      parse_mode: "Markdown",
    };

    bot
      .sendMessage(-946511817, payload, opts)
      .then((res) => {
        resolve(true);
      })
      .catch((e) => reject("Failed To send notif"));
  });
};

module.exports = tele;
