const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const tele = require("./tele");
const TelegramBot = require("node-telegram-bot-api");

const upload = async (req, res) => {
  try {
    console.log(req.files.data.data);

    // cover exl file upload to json
    const datajson = excelToJson({
      source: req.files.data.data,
    });

    // overwite save to json
    fs.writeFileSync("./src/file/data.json", JSON.stringify(datajson));

    res.send("uploaded!");
  } catch (e) {
    res.send(e);
  }
};

const read = async (req, res) => {
  try {
    let json = fs.readFileSync("./src/file/data.json");

    let arr = JSON.parse(json)["Sheet1"];

    let arr_notify = arr.map((e) => e.M);

    console.log(arr_notify);

    res.send(json);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const count = async (req, res) => {
  try {
    let json = fs.readFileSync("./src/file/data.json");

    let arr = JSON.parse(json)["Sheet1"];

    console.log(
      new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })
    );

    const { birthtime, mtime } = fs.statSync("./src/file/data.json");
    let file_uploaded = new Date(mtime).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    res.send({ total_file_row: arr.length, file_uploaded: file_uploaded });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const check_notif_today = async (req, res) => {
  try {
    let json = fs.readFileSync("./src/file/data.json");
    let arr = JSON.parse(json)["Sheet1"];

    let found = arr.filter((e) => {
      return new Date().toDateString() === new Date(e.M).toDateString();
    });

    const token = "1590350768:AAFiIqGHLpAvkK6pOhaSnDqarY9Q6Mnnypk";
    const bot = new TelegramBot(token, { polling: true });

    for (const row of found) {
      console.log(row);

      let dob = new Date(row.K.toString().trim()).toLocaleDateString();
      let entry_date = new Date(row.H.toString().trim()).toLocaleDateString();
      let msg = `
            Data Pensiun | Notif Tgl : ${new Date().toLocaleDateString()}
            \nEmploye code: ${row.B.toString().trim()}\nEmploye name: ${row.C.toString().trim()}\nJob Code: ${row.D.toString().trim()}\nSex: ${row.E.toString().trim()}\nStatus: ${row.F.toString().trim()}\nAfedling: ${row.G.toString().trim()}\n Entry Date: ${entry_date}\n Place of Birth: ${row.J.toString().trim()}\n Date of Birth: ${dob}\n
            `;
      await tele(msg, bot);
    }
    res.send(found);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

module.exports = { upload, read, check_notif_today, count };
