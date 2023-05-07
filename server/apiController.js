const { query } = require("express-validator");
const Services = require("./apiServices.js");

module.exports.postData = function(req, res) {
  const error = query(req).exists();
  if (!error.isEmpty()) {
    console.log("errors ", error);
  }

  Services.summaryService(req).then(result => {
    return res.status(200).send(result);
  })
}