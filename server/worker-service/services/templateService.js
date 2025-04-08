
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");

function parseSOAPNotes(text) {
  const sections = text.split(/\n(?=\**\[.*?\]\**)/g);
  let result = {};

  sections.forEach((section, index) => {
    const match = section.match(/^\**\[(.*?)\]\**\n?(.*)/s);
    if (match) {
      const title = match[1].replace(/:/g, "").trim();
      const content = match[2].trim();
      result[`${index + 1}_heading`] = title;
      result[`${index + 1}_text`] = content;
    }
  });

  return result;
}



async function templateTranscript(transcription, customTemplate, geminiKey) {
    const model = new ChatGoogleGenerativeAI({
        apiKey: geminiKey,
        temperature: 1.0,
          topP: 0.9,
          maxOutputTokens: 8192,
        model: "gemini-1.5-pro"
      });
      
  const prompt = new PromptTemplate({
    template: customTemplate,
    inputVariables: ["transcription"],
  });


  const chain = RunnableSequence.from([prompt, model]);

  const response = await chain.invoke({ transcription });
  const templatedTranscript = response.content.trim();

return parseSOAPNotes(templatedTranscript);
}

module.exports = { templateTranscript };