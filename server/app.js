const express = require("express");
const controller = require("./src/machine/upload");
const fileUpload = require("express-fileupload");
const app = express();
const port = 1337;
var cors = require("cors");

const router = express.Router();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/read", controller.read);
router.get("/check-today", controller.check_notif_today);
router.post("/upload", controller.upload);

app.use(fileUpload());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
