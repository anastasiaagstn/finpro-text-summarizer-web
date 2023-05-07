const axios = require("axios");

module.exports.openAiSummarize = async function (textToSummarize) {
  let apiKey = "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";
  const requestData = {
    prompt: "Please summarize the following text using extractive method: " + textToSummarize,
    max_tokens: 60,
    temperature: 0.5,
    stop: "\n"
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_API_KEY_HERE ${apiKey}`
    },
  };
  
  let summary;
  axios
    .post("https://api.openai.com/v1/engines/davinci/completions", requestData, config)
    .then((response) => {
      summary = response.data.choices[0].text;
      console.log(summary);
    })
    .catch((error) => {
      console.error(error);
    });

  return summary;
}