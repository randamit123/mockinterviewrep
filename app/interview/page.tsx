"use client";

import { useRef, useState, ChangeEvent } from "react";

import { speechToText } from "@/utils/speech_to_text";
import { getGPTResponse } from "@/utils/gpt";
import { getTextToSpeech } from "@/utils/text_to_speech";

enum Stage {
  NotStarted,
  Interviewing,
  Ending,
  Ended,
}

export default function Interview() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onJobTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setJobTitle(event.target.value);
  };

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [interviewAnalysis, setInterviewAnalysis] = useState("");
  const shouldContinueRef = useRef(true);
  const [stage, setStage] = useState(Stage.NotStarted);

  const driveInterview = async () => {
    const intialPrompt = `
      You're InterviewerGPT, a friendly and relaxed AI tech recruiter,
      experienced in conducting phone interviews for ${jobTitle} 
      who want to improve their interview skills. Your main goal is to 
      ask me relevant and specific questions about the role, industry, 
      and our company, while naturally guiding the conversation.

      You are ready to help ${name} rock his interview for a ${jobTitle} 
      role at SHMOOGLE, our company that's similar to Meta, Google, and Amazon.

      While you conduct the interview, you should be encouraging, but
      remember to hold all insights and feedback until after the
      interview.

      When you are told "End Interview", analyze our conversation and
      highlight how ${name} can improve his answers.

      Here's how the interview will go:
        1.  An introduction from you (stay in character)
        2.  First Scenario question
        3.  Wait for ${name}'s (the user's) response
        4.  Ask any relevant follow-up questions or seek further
            clarification.
        5.  Repeat steps 2-4 until you are told "End Interview"

      Now, start the interview with step 1.
    `;

    const messages: any = [{ role: "system", content: intialPrompt }];

    while (shouldContinueRef) {
      setIsLoading(true);
      const response = await getGPTResponse(messages);
      if (response === undefined) {
        console.error("GPT3 API returned undefined");
        continue;
      }
      console.log("Assistant: ", response);
      messages.push({ role: "assistant", content: response });

      if (audioPlayerRef.current) {
        console.log("Generating audio...");
        const urlAudioBlob = await getTextToSpeech(response);
        audioPlayerRef.current.src = urlAudioBlob;
        console.log("Playing audio...");
        setIsLoading(false);
        setIsAISpeaking(true);
        await audioPlayerRef.current.play();

        while (!audioPlayerRef.current.ended) {
          if (!shouldContinueRef.current) {
            audioPlayerRef.current.pause();
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        setIsAISpeaking(false);
      }

      if (!shouldContinueRef.current) {
        break;
      }

      console.log("Listening...");
      setIsListening(true);
      const transcript = await speechToText();
      setIsListening(false);
      console.log("User:", transcript);
      messages.push({ role: "user", content: transcript });
      if (transcript.toLowerCase() === "end the interview") {
        toggleInterview();
      }
    }

    messages.push({
      role: "user",
      content: `
        End Interview. Based on the conversation in the mock interview,
        please provide an analysis of the interviewee's strengths and
        weaknesses. Consider their answers, communication skills,
        technical knowledge, and overall performance. Highlight specific
        areas where they excelled and areas that could be improved.

        Strengths:
        1.  Mention the interviewee's strong points, such as
            well-articulated responses, clear communication, or solid
            technical knowledge.
        2.  Highlight any notable achievements or skills demonstrated
            during the interview.
        3.  Provide specific examples to support your assessment of
            their strengths.
      
        Weaknesses:
        1.  Identify areas where the interviewee struggled or could
            improve, such as incomplete answers, lack of technical
            depth, or difficulty in explaining concepts.
        2.  Suggest ways in which they could enhance their performance,
            such as studying specific topics or practicing interview
            scenarios.
        3.  Again, provide specific examples to illustrate their
            weaknesses or areas for improvement.
      
        Overall Assessment:
        1.  Offer an overall assessment of the interviewee's
            performance, taking into account their strengths and
            weaknesses.
        2.  Provide constructive feedback on how they can further
            develop their interview skills.
        3.  Encourage them to reflect on their performance and suggest
            ways they can enhance their future interviews.
        
        Please write a detailed analysis of the interviewee's
        performance, addressing the points mentioned above. Remember to
        be constructive and supportive in your feedback.
      `,
    });
    const response = await getGPTResponse(messages);
    if (response === undefined) {
      console.error("GPT3 API returned undefined");
      return;
    }
    console.log("Assistant: ", response);
    setInterviewAnalysis(response);
    setStage(Stage.Ended);
  };

  const toggleInterview = () => {
    if (stage === Stage.NotStarted) {
      console.log("start interview");
      driveInterview();
      setStage(Stage.Interviewing);
    } else {
      console.log("end interview");
      shouldContinueRef.current = false;
      setStage(Stage.Ended);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col gap-12 pt-28">
      <span className="relative flex h-70 w-70 mx-auto">
        <span
          className={`${
            isAISpeaking ? "animate-ping" : ""
          } absolute inline-flex h-full w-full rounded-full ${
            isLoading
              ? "bg-amber-100"
              : isListening
              ? "bg-green-300"
              : "bg-slate-400"
          } opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-80 w-80 ${
            isLoading
              ? "bg-amber-200"
              : isListening
              ? "bg-green-400"
              : "bg-slate-500"
          }`}
        ></span>
      </span>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-28">
        <audio ref={audioPlayerRef}></audio>
        <div>
          <input
            type="text"
            placeholder="First Name"
            className="border px-6 py-4 rounded-xl"
            onChange={onNameChange}
          />
          <p className="text-xs text-gray-500 pt-1 px-2">Your name of choice</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Job Title"
            className="border px-6 py-4 rounded-xl"
            onChange={onJobTitleChange}
          />
          <p className="text-xs text-gray-500 pt-1 px-2">
            The job you’re interviewing for!
          </p>
        </div>
        <div>
          <button
            className="button text-lg"
            data-btn-intent="primary"
            data-btn-size="extra-large"
            onClick={toggleInterview}
            disabled={
              stage === Stage.Ending ||
              stage === Stage.Ended ||
              name == "" ||
              jobTitle == ""
            }
          >
            {stage == Stage.NotStarted
              ? "Start Interview"
              : stage == Stage.Interviewing
              ? "End Interview"
              : stage == Stage.Ending
              ? "Ending interview..."
              : "Interview Ended"}
          </button>
          <p className="text-xs text-gray-500 pt-1">{`Begin!`}</p>
        </div>
      </div>
      {stage == Stage.Ended && (
        <div className="mt-16 mx-20">
          <h1 className="text-center text-2xl">Session Notes:</h1>
          <br />
          {interviewAnalysis.split("\n").map((line, i) => (
            <p key={i} className="text-justify mt-5 text-md">
              {line}
            </p>
          ))}
        </div>
      )}
      <div className="h-36 w-full" />
    </div>
  );
}
