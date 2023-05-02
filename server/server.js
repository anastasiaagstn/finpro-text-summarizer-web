const http = require("http");
const cors = require("cors");
const port = 3000
const express = require("express");
const router = express.Router();
const path = require("path");

const app = express();
const bodyParser = require("body-parser");


router.use(function(req, res, next) {
  console.log("#endpoint: " + req.method + " " + req.originalUrl);
  
  next();
});

const corsOptions = {
  "origin": "*",
  "methods": "GET,POST,PUT,DELETE"
}

router.use(cors(corsOptions));

const Services = require("./servicesFunction.js");

router.post('/test-api', Services.testApi);

app.use(bodyParser.json({limit: "5mb"}));
app.use("/", router);

http.createServer(app).listen(port, () => {
  console.log(`Listening on port ${port}...`);
});