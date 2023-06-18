import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

/*
const configuration = new Configuration({
  organization: "org-EKq2MTDgVPY84mh3CENbt66k",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const prompt = "";*/

export async function getGPTResponse(
  history: ChatCompletionRequestMessage[],
  text: any
) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "OpenAI-Organization": "org-EKq2MTDgVPY84mh3CENbt66k",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: text }, ...history],
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );
  const data = await response.json();

  return data.choices[0].message?.content;
}
