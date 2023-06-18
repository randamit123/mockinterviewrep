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
            <audio ref={audioPlayerRef} controls></audio>
            <button
              className="h-16 w-full mt-8 bg-gray-400 text-white text-3xl"
              onClick={async () => {
                const transcript = await speechToText();
                console.log("Final transcript:", transcript);
                const response = await getGPTResponse([], transcript);
                console.log(response);
                const urlAudioBlob = await getTextToSpeech(response);
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.src = urlAudioBlob;
                  audioPlayerRef.current?.play();
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
