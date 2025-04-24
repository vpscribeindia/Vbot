
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



async function templateTranscript(transcription, template, geminiKey) {
    const model = new ChatGoogleGenerativeAI({
        apiKey: geminiKey,
        temperature: 1.0,
          topP: 0.9,
          maxOutputTokens: 8192,
        model: "gemini-1.5-pro"
      });
      
  const prompt = new PromptTemplate({
    template: `You are a medical AI assistant. Extract structured clinical notes in {template_name}.
    ### **Input:**
    {transcription}
    ### **Output Guidelines:**
    - **Strictly** use the exact headings enclosed in square brackets.  
    - Do **not** use markdown-style headings like "##".
    - Keep responses **structured and formatted** properly.
    ### **SOAP Notes Output:**
    {headings} 
    `,
    inputVariables: ["transcription","headings", "template_name"],
  });


  const chain = RunnableSequence.from([prompt, model]);

  const response = await chain.invoke({ transcription, headings: template.headings, template_name: template.templateName });
  const templatedTranscript = response.content.trim();

return parseSOAPNotes(templatedTranscript);
}

module.exports = { templateTranscript };