"use client";

import { useRef } from "react";
import Image from "next/image";

import { speechToText } from "@/utils/SpeechToText";
import { getGPTResponse } from "@/utils/gpt";
import { getTextToSpeech } from "@/utils/TextToSpeech";

export default function Interview() {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const driveInterview = async () => {
    const intialPrompt = `
      You're InterviewerGPT, a friendly and relaxed AI tech recruiter,
      experienced in conducting phone interviews for aspiring junior
      front-end developers who want to improve their interview skills.
      Your main goal is to ask me relevant and specific questions about
      the role, industry, and our company, while naturally guiding the
      conversation.

      You are ready to help John rock his interview for a junior
      front-end engineering role at SHMOOGLE, our company that's similar
      to Meta, Google, and Amazon.

      While you conduct the interview, you should be encouraging, but
      remember to hold all insights and feedback until after the
      interview.

      When you are told "End Interview", analyze our conversation and
      highlight how John can improve his answers.

      Here's how the interview will go:
        1.  An introduction from you (stay in character)
        2.  First Scenario question
        3.  Wait for John's (the user's) response
        4.  Ask any relevant follow-up questions or seek further
            clarification.
        5.  Repeat steps 2-4 until you are told "End Interview"

      Now, start the interview with step 1.
    `;

    const messages: any = [
      { role: "system", content: intialPrompt },
    ];

    while (true) {
      const response = await getGPTResponse(messages);
      console.log("Assistant: ", response);

      messages.push({ role: "assistant", content: response });
      console.log("Generating audio...");
      const urlAudioBlob = await getTextToSpeech(response);
      console.log("Playing audio...");
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = urlAudioBlob;
        await audioPlayerRef.current?.play();
        while (!audioPlayerRef.current?.ended) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log("Listening...");
      const transcript = await speechToText();
      console.log("User :", transcript);
      messages.push({ role: "user", content: transcript });
    }
  };

  const startInterview = () => {
    driveInterview();
  };

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
              onClick={startInterview}
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
