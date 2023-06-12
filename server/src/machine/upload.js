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


const read = async(req,res) => {
    try{
        
        let json = fs.readFileSync('./src/file/data.json');

        let arr= JSON.parse(json)['Sheet1']

        let arr_notify = arr.map(e => e.M)

        console.log(arr_notify);

        res.send(json)
    }catch(e){
        console.log(e);
        res.send(e)
    }
}


const check_notif_today = async (req, res) => {
    try{
        let json = fs.readFileSync('./src/file/data.json');
        let arr= JSON.parse(json)['Sheet1']

        let found = arr.filter(e => {
            return new Date().toDateString() === new Date(e.M).toDateString()
        })

        const token = "1590350768:AAFiIqGHLpAvkK6pOhaSnDqarY9Q6Mnnypk";
        const bot = new TelegramBot(token, { polling: true });

        for (const row of found) {
            console.log(row);
            let msg = 
            `
            Notif Tgl : ${new Date().toLocaleDateString()}
            \n\nEmploye code: ${row.B.toString().trim()}\nEmploye name: ${row.C.toString().trim()}\nJob Code: ${row.D.toString().trim()}\nSex: ${row.E.toString().trim()}\nStatus: ${row.F.toString().trim()}\nAfedling: ${row.G.toString().trim()}\n Entry Date: ${row.H.toString().trim()}\n Address: ${row.I.toString().trim()}\n Place of Birth: ${row.J.toString().trim()}\n Date of Birth: ${row.K.toString().trim()}\n Notify: ${row.L.toString().trim()}\n Notify: ${row.M.toString().trim()}\n
            `
            await tele(msg, bot)
        }


        res.send(found)
    }catch(e){
        console.log(e);
        res.send(e)
    }
}



module.exports = {upload, read, check_notif_today};
