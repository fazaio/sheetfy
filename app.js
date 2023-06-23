var cors = require("cors");
const express = require("express");
const controller = require("./src/machine/upload");
const fileUpload = require("express-fileupload");
const app = express();
const port = 1337;

const router = express.Router();

app.use(cors());

router.get("/", (req, res) => {
  // res.sendFile("./index.html");
  res.sendFile("index.html", { root: "." });
});
router.get("/count", controller.count);
router.get("/read", controller.read);
router.get("/check-today", controller.check_notif_today);
router.post("/upload", controller.upload);

app.use(fileUpload());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
