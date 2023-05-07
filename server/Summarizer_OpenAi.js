const axios = require("axios");

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_DELAY = 30000; // 30 second

module.exports.generateSummary = async function (textToSummarize) {
  const apiUrl = "https://api.openai.com/v1/completions";
  const apiKey = process.env.OPENAI_API_KEY;

  const params = {
    prompt: "Please summarize the following text: " + textToSummarize,
    model: "text-davinci-003",
    max_tokens: 2048,
    temperature: 0.5
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
  };

  try {
    const summary = await makeRequestWithRetries(apiUrl, params, config);
    console.log('Request succeeded:', summary);
    return summary.choices[0].text;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

function makeRequestWithRetries(url, requestData, config, retries = 0, backoffDelay = INITIAL_BACKOFF_DELAY) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.post(url, requestData, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (retries < MAX_RETRIES) {
            console.log(`Request failed. Retrying in ${backoffDelay} milliseconds...`);
            const nextBackoffDelay = backoffDelay * 2;
            makeRequestWithRetries(url, requestData, config, retries + 1, nextBackoffDelay)
              .then(resolve)
              .catch(reject);
          } else {
            reject(error);
          }
        });
    }, backoffDelay);
  });
}