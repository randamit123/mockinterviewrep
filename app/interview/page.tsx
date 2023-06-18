"use client";

import { useRef } from "react";
import Image from "next/image";
import { speechToText } from "@/utils/SpeechToText";
import { getGPTResponse } from "@/utils/gpt";
import { getTextToSpeech } from "@/utils/TextToSpeech";

export default function Interview() {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  return (
    <div>
      <div className="flex flex-col justify-center h-screen">
        <div className="my-auto">
          <Image
            className="mx-auto"
            alt="logo"
            src="/logo.svg"
            height={134}
            width={363}
            priority
          />
          <div className="mx-auto mt-8 text-6xl font-bold text-center">
            {`Let's get started!`}
          </div>
          <div className="w-80 mx-auto mt-16">
            <audio ref={audioPlayerRef}></audio>
            <button
              className="h-16 w-full mt-8 bg-gray-400 text-white text-3xl"
              onClick={async () => {
                const intialPrompt = `You're InterviewerGPT, a friendly and relaxed AI tech recruiter, experienced in conducting phone interviews for aspiring junior front-end developers who want to improve their interview skills. Your main goal is to ask me relevant and specific questions about the role, industry, and our company, while naturally guiding the conversation and providing actionable feedback to help me improve my communication and domain knowledge. Think of yourself as a caring friend who listens to my concerns and offers insights with understanding, compassion, and wisdom, all in a conversational tone. Remember to respond in a gentle and non-judgmental manner, tailored to my unique emotions and experiences, creating a safe space for professional development and growth.

                Hey there, John! I'm your InterviewerGPT, ready to help you rock your interview for a junior front-end engineering role at SHMOOGLE, our company that's similar to Meta, Google, and Amazon.
                
                While you conduct the interview, you should be encouraging, but stay dormant and hold all insight until after the interview.
                
                When you are told, "End Interview" analyze our conversation and highlight how I can improve my answers.
                
                Here's how the interview will go:
                
                Introduction (Stay in character)
                First Scenario question
                Wait for your response - Feel free to ask any additional questions or seek further clarification.`;

                const messages: any = [
                  { role: "system", content: intialPrompt },
                ];

                while (true) {
                  const response = await getGPTResponse(messages);
                  console.log("Assistant: ", response);

                  messages.push({ role: "assistant", content: response });
                  const urlAudioBlob = await getTextToSpeech(response);
                  if (audioPlayerRef.current) {
                    audioPlayerRef.current.src = urlAudioBlob;
                    // audioPlayerRef.current?.play();
                    // TOOD: Wait for audio to finish.
                  }

                  const transcript = await speechToText();
                  messages.push({ role: "user", content: transcript });
                  console.log("User :", transcript);
                }
              }}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*


*/
