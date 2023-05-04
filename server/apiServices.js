const utils = require("./utils.js");
const nlp = require("compromise/one");
const natural = require("natural");
const fs = require('fs/promises');
nlp.extend(require("compromise-sentences"));

module.exports.testApi = async function(req, res) {
  console.log("Running test api service");

  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }

  // let files = req.files;
  // let fileContent = files.Test
  // let text;
  // await getText(text, fileContent.data);
  // text = fileContent.toString('utf8');
  
  let body = utils.getBody(req);
  let sentenceAllBody = body.textDocument;
  
  let sentencesAll = req.query.textDocument;

  // add abbreviations
  let abbrevs = nlp().model.one.abbreviations;
  let newAbbrevs = {
    mrs: true
  };

  Object.assign(abbrevs, newAbbrevs);

  // tokenize sentences
  const tokenizedData = nlp(sentenceAllBody);
  // const tokenizedSentences = tokenizedData.json().map(sentence => {sentence.text});
  let splitSemiColon = tokenizedData.splitAfter('@hasSemicolon');
  // let newSentence = splitSemiColon.splitAfter('@');
  let tokenizedSentences = splitSemiColon.json().map(sentence => sentence.text);

  const frequencyMatrix = createFrequencyMatrix(tokenizedSentences);
  const tfMatrix = createTfMatrix(frequencyMatrix);
  const wordPerDocsTable = createDocumentsPerWords(frequencyMatrix);
  const idfMatrix = createIdfMatrix(frequencyMatrix, wordPerDocsTable,
    tokenizedSentences.length);
  const tfIdfMatrix = createTfIdfMatrix(tfMatrix, idfMatrix);
  const scores = scoreSentences(tfIdfMatrix);
  const threshold = findAverageScore(scores);
  const summary = generateSummary(tokenizedSentences, scores, 
    threshold * 0.6);

  const result = {
    // tokenizedSentences: tokenizedSentences,
    // tfMatrix: tfMatrix,
    // tfIdfMatrix: tfIdfMatrix,
    score: scores,
    summary: summary
    // arr: arr
  };

  return result;
}

// Calculate the frequency of words in each sentence
function createFrequencyMatrix(sentences) {
  // var wordTokenizer = new natural.WordTokenizer();
  let frequencyMatrix = {};

  for (const sentence of sentences) {
    let frequencyTable = {};
    const stemmedSentence = natural.PorterStemmer.tokenizeAndStem(sentence);

    for (const index in stemmedSentence) {
      let word = stemmedSentence[index];

      if (word in frequencyTable) {
        frequencyTable[word] += 1;
      } else {
        frequencyTable[word] = 1;
      }

      frequencyMatrix[sentence.slice(0,15)] = frequencyTable;
    }
  }

  return frequencyMatrix;
}

// Find the term frequencry (tf) for each word in a paragraph
function createTfMatrix(frequencyMatrix) {
  let tfMatrix = {};

  const frequencyMatrixKeys = Object.keys(frequencyMatrix);
  
  for (const fm_key of frequencyMatrixKeys) {
    if (frequencyMatrix.hasOwnProperty(fm_key)) {
      let tfTable = {};
      const frequencyTable = frequencyMatrix[fm_key];
      const frequencyTableKeys = Object.keys(frequencyTable);

      for (const ft_key of frequencyTableKeys) {
        if (frequencyTable.hasOwnProperty(ft_key)) {
          const count = frequencyTable[ft_key];
          tfTable[ft_key] = count/frequencyTableKeys.length;
        }
      }
  
      tfMatrix[fm_key] = tfTable;
    }
  }

  return tfMatrix;
}

// Calculate how many sentences contain a word, called Documents per words matrix
function createDocumentsPerWords(frequencyMatrix) {
  let wordPerDocsTable = {};
  const frequencyMatrixKeys = Object.keys(frequencyMatrix);
  
  for (const fm_key of frequencyMatrixKeys) {
    if (frequencyMatrix.hasOwnProperty(fm_key)) {
      const frequencyTable = frequencyMatrix[fm_key];
      const frequencyTableKeys = Object.keys(frequencyTable);

      for (const word of frequencyTableKeys) {
        if (frequencyTable.hasOwnProperty(word)) {
          if (wordPerDocsTable.hasOwnProperty(word)) {
            wordPerDocsTable[word] += 1;
          } else {
            wordPerDocsTable[word] = 1;
          }
        }
      }
    }
  }

  return wordPerDocsTable;
}

// find IDF for each word in a paragraph
function createIdfMatrix(frequencyMatrix, countDocPerWords, totalDocuments){
  let idfMatrix = {};
  const frequencyMatrixKeys = Object.keys(frequencyMatrix);
  
  for (const fm_key of frequencyMatrixKeys) {
    if (frequencyMatrix.hasOwnProperty(fm_key)) {
      let idfTable = {};
      const frequencyTable = frequencyMatrix[fm_key];
      const frequencyTableKeys = Object.keys(frequencyTable);

      for (const word of frequencyTableKeys) {
        if (frequencyTable.hasOwnProperty(word)) {
          idfTable[word] = Math.log10(totalDocuments/parseFloat(
            countDocPerWords[word]
          ));
        }
      }

      idfMatrix[fm_key] = idfTable;
    }
  }

  return idfMatrix;
}

// find tf idf matrix
function createTfIdfMatrix(tfMatrix, idfMatrix) {
  let tfIdfMatrix = {};
  const sentences = Object.keys(tfMatrix);

  for (const sentence of sentences) {
    if (tfMatrix.hasOwnProperty(sentence) &&
      idfMatrix.hasOwnProperty(sentence)) {
      let tfIdfTable = {};
      let frequencyTable1 = tfMatrix[sentence];
      let frequencyTable2 = idfMatrix[sentence];
      const words = Object.keys(frequencyTable1);

      for (const word of words) {
        if (frequencyTable1.hasOwnProperty(word) 
          && frequencyTable2.hasOwnProperty(word)) {
            tfIdfTable[word] = frequencyTable1[word] * frequencyTable2[word];
        }
      }

      tfIdfMatrix[sentence] = tfIdfTable;
    }
  }

  return tfIdfMatrix;
}

// scoring the sentences
function scoreSentences(tfIdfMatrix) {
  let sentenceValue = {};
  const sentences = Object.keys(tfIdfMatrix);

  for (const sentence of sentences) {
    if (tfIdfMatrix.hasOwnProperty(sentence)) {
      let totalScorePerSentence = 0;
      const frequencyTable = tfIdfMatrix[sentence];
      const words = Object.keys(frequencyTable);
      const countWordsInSentence = Object.keys(frequencyTable).length;
      
      for (const word of words) {
        if (frequencyTable.hasOwnProperty(word)) {
          totalScorePerSentence += frequencyTable[word];
        }
      }

      sentenceValue[sentence] = totalScorePerSentence / countWordsInSentence;
    }
  }

  return sentenceValue;
}

// average score
function findAverageScore(sentenceValue) {
  let sumValue = 0;
  const keys = Object.keys(sentenceValue);

  for (const key of keys) {
    if (sentenceValue.hasOwnProperty(key)) {
      sumValue += sentenceValue[key];
    }
  }

  average = sumValue / keys.length;

  return average;
}

function generateSummary(sentences, sentenceValue, threshold) {
  let summary = "";

  for (let sentence of sentences) {
    if (sentences.indexOf(sentence) === 0) {
      summary += sentence;
      continue
    }
    const sentenceKey = sentence.slice(0,15);
    const boolean = sentenceValue.hasOwnProperty(sentenceKey);

    if ( sentenceValue.hasOwnProperty(sentenceKey)
      && (sentenceValue[sentenceKey] >= threshold)) {
        summary += " " + sentence;
    }
  }

  return summary;
}

async function getText(text, data) {
  try {
    fs.readFile(data, (err, resultedData) => {
      if (err) {
        console.error(err);
        return;
      }
      text = resultedData;
    });
  } catch (err) {
    console.log(err);
  }
}