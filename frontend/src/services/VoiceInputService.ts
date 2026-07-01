export class VoiceInputService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptUpdate: (transcript: string) => void;
  private onError: (error: string) => void;

  constructor(onTranscriptUpdate: (transcript: string) => void, onError: (error: string) => void) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onError = onError;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.onError('Speech recognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      this.onTranscriptUpdate(currentTranscript);
    };

    this.recognition.onerror = (event: any) => {
      this.onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  startListening() {
    if (!this.recognition) {
      this.onError('Speech recognition is not initialized.');
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      this.onError('Failed to start speech recognition.');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
    return this.isListening;
  }
}
