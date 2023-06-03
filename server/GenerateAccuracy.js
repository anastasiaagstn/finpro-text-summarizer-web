const nlp = require("compromise");

module.exports.generateAccuracy = function(generatedSummary, referenceSummary) {
  console.log(">> Generate Rouge Score");
  const words_generatedSummary = textIntoArray(generatedSummary);
  let words_referenceSummary = textIntoArray(referenceSummary);

  const generatedLength = words_generatedSummary.length;
  const referenceLength = words_referenceSummary.length;

  let capturedWords = 0;

  for (let index = 0; index < generatedLength; index++) {
    let currentWord = words_generatedSummary[index];
    if(words_referenceSummary.includes(currentWord)){
      capturedWords++;
      words_referenceSummary.splice(words_referenceSummary.indexOf(currentWord), 1);
    }
  }

  const precision = capturedWords/generatedLength;
  const recall = capturedWords/referenceLength;
  const f1Score = (2 * precision * recall) / (precision + recall)

  return {
    Precision: precision,
    Recall: recall,
    F1Score: f1Score
  }
}

function textIntoArray(text) {
  const tokenizedText = nlp(text);

  const words = tokenizedText.terms().out('array');

  const cleanedWords = words.map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase());

  return cleanedWords;
}