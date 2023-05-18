const http = require("http");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const port = 3000;
const router = express.Router();
const Controller = require("./apiController.js");

dotenv.config();

/*** Router Settings ***/

router.use(function(req, res, next) {
  console.log("#endpoint: " + req.method + " " + req.originalUrl);
  
  next();
});

const corsOptions = {
  "origin": "*",
  "methods": "GET,POST,PUT,DELETE"
}

router.use(cors(corsOptions));
router.post('/summarize', Controller.postData);

/*** App Settings ***/

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "5mb"}));

app.use("/", router);

http.createServer(app).listen(port, () => {
  console.log(`Listening on port ${port}...`);
});