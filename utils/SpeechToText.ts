export function speechToText() {
  console.log("Hello world");

  return new Promise((resolve, reject) => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      let noteContent = "";
      let silenceTimeout: NodeJS.Timeout | null = null;
      const pauseThreshold = 2500;
      let isRecording = false;

      recognition.continuous = true;

      recognition.onresult = function (event: any) {
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }

        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const mobileRepeatBug =
          current === 1 && transcript === event.results[0][0].transcript;

        if (!mobileRepeatBug) {
          noteContent += transcript;
        }

        silenceTimeout = setTimeout(function () {
          recognition.stop();
          resolve(noteContent);
          isRecording = false;
        }, pauseThreshold) as unknown as NodeJS.Timeout;
      };

      recognition.onstart = function () {
        console.log("Voice recognition activated. Speak into the microphone.");
      };

      recognition.onspeechend = function () {
        console.log("Voice recognition turned off due to silence.");
      };

      recognition.onerror = function (event: any) {
        if (event.error === "no-speech") {
          console.log("No speech was detected. Try again.");
        }
      };

      recognition.start();
    } catch (e) {
      reject(new Error("Speech recognition not supported"));
    }
  });
}
