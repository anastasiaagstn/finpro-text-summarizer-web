const nlp = require("compromise");
// nlp.extend(require("compromise-sentences"));

module.exports.generateRouge = function(generatedSummary, referenceSummary) {
  console.log(">> Generate Rouge Score");
  const words_generatedSummary = textIntoArray(generatedSummary);
  const words_referenceSummary = textIntoArray(referenceSummary);

  const generatedLength = words_generatedSummary.length;
  const referenceLength = words_referenceSummary.length;

  let capturedWords = 0;

  for (let index = 0; index < generatedLength; index++) {
    if(words_referenceSummary.includes(words_generatedSummary[index])){
      capturedWords++;
    }
  }

  const precision = capturedWords/referenceLength;
  const recall = capturedWords/generatedLength;

  return {
    precision: precision,
    recall: recall
  }
}

function textIntoArray(text) {
  const tokenizedText = nlp(text);

  const words = tokenizedText.terms().out('array');

  const cleanedWords = words.map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase());

  return cleanedWords;
}