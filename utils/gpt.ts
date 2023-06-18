import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
const configuration = new Configuration({
  organization: "org-mExdRzzKnMwXnpSs2W4mqiow",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = "";

async function getGPTResponse(history: ChatCompletionRequestMessage[]) {
  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": prompt},
        ...history,
      ]
    }
  )
  return response.data.choices[0].message?.content;
}
