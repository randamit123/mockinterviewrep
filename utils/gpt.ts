import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

export async function getGPTResponse(messages: ChatCompletionRequestMessage[]) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "OpenAI-Organization": "org-EKq2MTDgVPY84mh3CENbt66k",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      messages,
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );
  const data = await response.json();

  return data.choices[0].message?.content;
}
