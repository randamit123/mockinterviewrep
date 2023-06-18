const trySpeechToText = () => {
  return new Promise<string>((resolve, reject) => {
    const SpeechRecognition = (
      window.SpeechRecognition || window.webkitSpeechRecognition
    );

    let recognition = new SpeechRecognition();
    let silenceTimeout: NodeJS.Timeout | null = null;
    let note = "";

    const onResult = (event: SpeechRecognitionEvent) => {
      if (silenceTimeout !== null) {
        clearTimeout(silenceTimeout);
      }
  
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const mobileRepeatBug =
        current === 1 && transcript === event.results[0][0].transcript;
  
      if (!mobileRepeatBug) {
        note += transcript;
      }
  
      silenceTimeout = setTimeout(() => {
        recognition.stop();
        resolve(note);
      }, 2500);
    }

    const onError = (event: SpeechRecognitionError) => {
      if (silenceTimeout !== null) {
        clearTimeout(silenceTimeout);
      }
      reject(event);
    }

    recognition.continuous = true;
    recognition.onresult = onResult;
    recognition.onerror = onError;
    recognition.start();
    console.log("Listening started");
  });
};

export const speechToText = async () => {
  while (true) {
    try {
      return await trySpeechToText();
    } catch (error) {
      console.log(error);
    }
  }
};
