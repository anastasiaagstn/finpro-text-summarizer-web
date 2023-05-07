const utils = require("./utils.js");

const chatGPTSummarizer = require("./Summarizer_OpenAi.js");
const tfIdfSummarizer = require("./Summarizer_TfIdf.js");
const generateRouge = require("./Generate_Rouge.js")

module.exports.summaryService = async function(req, res) {
  console.log(">> Summary Service");
  
  let body = utils.getBody(req);
  let sentenceAllBody = body.textDocument;

  let result = {};

  if (sentenceAllBody === "") {
    let error = "no text detected";
    result.error = error;

    return result;
  }

  const generatedSummary = tfIdfSummarizer.summarizeText(sentenceAllBody);
  const referenceSummary = await chatGPTSummarizer.generateSummary(sentenceAllBody);

  const rouge = generateRouge.generateRouge(generatedSummary, referenceSummary);

  result = {
    summary: generatedSummary,
    rouge: rouge
  };

  console.log(">> End Service");
  return result;
}