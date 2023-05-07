const utils = require("./utils.js");

const chatGPTSummarizer = require("./Summarizer_OpenAi.js");
const tfIdfSummarizer = require("./Summarizer_TfIdf.js");

module.exports.summaryService = async function(req, res) {
  console.log(">> Summary Service");
  
  let body = utils.getBody(req);
  let sentenceAllBody = body.textDocument;

  const summary = tfIdfSummarizer.summarizeText(sentenceAllBody);
  const referenceSummary = await chatGPTSummarizer.generateSummary(sentenceAllBody);

  // const accuracy = evaluateSummarizer(summary, );

  const result = {
    score: scores,
    summary: summary,
    referenceSummary: referenceSummary
  };

  return result;
}

// function evaluateSummarizer(summary, referenceSummary) {
//   // calculate precision and recall using the Rouge metric
//   const scores = rouge(summary, referenceSummary);
//   const precision = scores["rouge-1"]["p"];
//   const recall = scores["rouge-1"]["r"];

//   return { precision, recall };
// }