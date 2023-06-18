async function getTextToSpeech(text: string) {
  var apiKey = process.env.NEXT_PUBLIC_ELEVEN_API;
  var voiceId = "21m00Tcm4TlvDq8ikWAM";
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "xi-api-key": String(apiKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  return audioUrl;
}

export const playTextToSpeech = async (text: string, audioElement: HTMLAudioElement) => {
  console.log("Generating audio...");
  const urlAudioBlob = await getTextToSpeech(text);
  audioElement.src = urlAudioBlob;
  console.log("Playing audio...");
  await audioElement.play();
  while (!audioElement.ended) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
