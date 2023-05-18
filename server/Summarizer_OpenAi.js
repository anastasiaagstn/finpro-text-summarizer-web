const axios = require("axios");

module.exports.fetchReferenceSummary = async function (textToSummarize) {
  console.log(">> OpenAI summarizer");
  const apiUrl = "https://api.openai.com/v1/completions";
  const apiKey = process.env.OPENAI_API_KEY;

  const params = {
    prompt: "Please summarize the following text using extractive summarization method: " + textToSummarize,
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
    const response = await axios.post(apiUrl, params, config);
    console.log('Request succeeded:', response.data);
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}