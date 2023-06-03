const utils = require("./utils.js");

const chatGPTSummarizer = require("./Summarizer_OpenAi.js");
const tfIdfSummarizer = require("./Summarizer_TfIdf.js");
const generateAccuracy = require("./GenerateAccuracy.js")

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

  const generatedSummary = tfIdfSummarizer.generateSummary(sentenceAllBody);
  const referenceSummary = await chatGPTSummarizer.fetchReferenceSummary(sentenceAllBody);

  const rouge = generateAccuracy.generateAccuracy(generatedSummary, referenceSummary);

  result = {
    summary: generatedSummary,
    referenceSummary: referenceSummary,
    rouge: rouge
  };

  console.log(">> End Service");
  return result;
}