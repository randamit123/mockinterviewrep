class MySpeechRecognizer {
  recognition: any;
  note: string;

  silenceTimeout: NodeJS.Timeout | null;
  onSpeakingDone: (_: string) => void;

  constructor(onSpeakingDone: (_: string) => void) {
    this.note = "";
    this.silenceTimeout = null;
    this.onSpeakingDone = onSpeakingDone;
    this.setup();
  }

  setup() {
    if (this.recognition) {
      this.recognition.abort();
    }

    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }

    this.note = "";

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;

    this.recognition.onresult = this.onResult;
    this.recognition.onerror = this.onError;
  }

  start() {
    this.recognition.start();
  }

  onResult(event: any) {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }

    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const mobileRepeatBug =
      current === 1 && transcript === event.results[0][0].transcript;

    if (!mobileRepeatBug) {
      if (this.note) {
        // NOTE: this is needed beucase this.note is undefined for some reason. I blame it on typscript - Akshat
        this.note += transcript || "";
      } else {
        this.note = transcript || "";
      }
    }

    this.silenceTimeout = setTimeout(() => {
      console.log("onSpeadkingDone", this.onSpeakingDone);

      this.onSpeakingDone(this.note);
      this.recognition.stop();
      this.note = "";
    }, 2500) as unknown as NodeJS.Timeout;
  }

  onError(event: any) {
    if (event.error === "no-speech") {
      this.setup();
    }
  }
}

export function speechToText() {
  return new Promise((resolve, reject) => {
    try {
      const mcr = new MySpeechRecognizer(resolve);
      mcr.start();
    } catch (e) {
      reject(new Error("Speech recognition not supported"));
    }
  });
}
