const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const tele = require("./tele");
const TelegramBot = require("node-telegram-bot-api");
const moment = require("moment");

const upload = async (req, res) => {
  try {
    // cover exl file upload to json
    const datajson = excelToJson({
      source: req.files.data.data,
    });
    const total_file = datajson["Sheet1"].length;

    console.log("upload data !...");
    console.log(total_file, "total");

    // overwite save to json
    fs.writeFileSync("/tmp/data.json", JSON.stringify(datajson));

    res.send({ total: total_file });
  } catch (e) {
    res.send(e);
  }
};

const read = async (req, res) => {
  try {
    let json = fs.readFileSync("/tmp/data.json");

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
    let json = fs.readFileSync("/tmp/data.json");

    let arr = JSON.parse(json)["Sheet1"];

    console.log(
      new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })
    );

    const { birthtime, mtime } = fs.statSync("/tmp/data.json");
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
    let json = fs.readFileSync("/tmp/data.json");
    let arr = JSON.parse(json)["Sheet1"];

    const _day25_from_now = new Date(
      new moment().add(25, "day")
    ).toDateString();

    let found = arr.filter((e) => {
      return _day25_from_now === new Date(e.M).toDateString();
    });

    // console.log(_day25_from_now);

    const token = "1590350768:AAFiIqGHLpAvkK6pOhaSnDqarY9Q6Mnnypk";
    const bot = new TelegramBot(token, { polling: true });

    if (found.length > 0) {
      for (const row of found) {
        console.log(row);
        let dob = new Date(row.K.toString().trim()).toLocaleDateString("id-ID");
        let entry_date = new Date(row.H.toString().trim()).toLocaleDateString(
          "id-ID"
        );
        let pensiun = new Date(row.M.toString()).toLocaleDateString("id-ID");
        let msg = `*DATA KARYAWAN PENSIUN* \nNotif Tgl : ${new Date().toLocaleDateString(
          "id-ID"
        )}
              \nEmploye code: ${row.B.toString().trim()}\nEmploye name: ${row.C.toString().trim()}\nJob Code: ${row.D.toString().trim()}\nSex: ${row.E.toString().trim()}\nStatus: ${row.F.toString().trim()}\nAfedling: ${row.G.toString().trim()}\n Entry Date: ${entry_date}\n Place of Birth: ${row.J.toString().trim()}\n Date of Birth: ${dob}\n Pensiun: ${pensiun}
              `;
        await tele(msg, bot);
      }
    } else {
      let msg = `Data Pensiun | Notif Tgl : ${new Date().toLocaleDateString(
        "id-ID"
      )}\nTidak ada terdeteksi.`;
      await tele(msg, bot);
    }

    res.send(found);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

module.exports = { upload, read, check_notif_today, count };
