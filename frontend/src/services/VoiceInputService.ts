export class VoiceInputService {
  private recognition: any = null;
  private isListening: boolean = false;
  private transcript: string = '';
  private onTranscriptUpdate: (text: string) => void = () => {};
  private onError: (error: string) => void = () => {};
  private onStop: () => void = () => {};
  private shouldRestart: boolean = false;
  private restartAttempts: number = 0;
  private static MAX_RESTART_ATTEMPTS = 5;

  constructor(
    onTranscriptUpdate: (text: string) => void,
    onError: (error: string) => void,
    onStop: () => void = () => {}
  ) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onError = onError;
    this.onStop = onStop;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      this.onError('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  startListening(): void {
    if (!this.recognition) {
      this.onError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      this.shouldRestart = true;
      this.restartAttempts = 0;
      this.isListening = true;
      this.transcript = '';
      this.recognition.start();
    } catch (error: any) {
      this.isListening = false;
      this.shouldRestart = false;
      if (error.name === 'InvalidStateError') {
        // Already started — stop and restart
        try {
          this.recognition.stop();
        } catch {}
        setTimeout(() => {
          try {
            this.isListening = true;
            this.transcript = '';
            this.recognition.start();
          } catch {
            this.isListening = false;
            this.onError('Failed to start microphone');
            this.onStop();
          }
        }, 200);
      } else {
        this.onError('Failed to start microphone');
        this.onStop();
      }
    }
  }

  stopListening(): void {
    this.shouldRestart = false;
    this.restartAttempts = 0;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
  }

  toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
    return this.isListening;
  }

  private handleResult(event: any): void {
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

    const combinedTranscript = finalTranscript || interimTranscript;
    if (combinedTranscript) {
      this.transcript = combinedTranscript;
      this.onTranscriptUpdate(combinedTranscript);
    }
  }

  private handleError(event: any): void {
    let errorMessage = 'Unknown error occurred';

    switch (event.error) {
      case 'not-allowed':
        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
        this.isListening = false;
        this.shouldRestart = false;
        this.onError(errorMessage);
        this.onStop();
        break;
      case 'no-speech':
        // Not fatal — just means silence. Restart if we should still be listening.
        if (this.shouldRestart && this.isListening) {
          this.tryRestart();
        }
        break;
      case 'audio-capture':
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
        this.isListening = false;
        this.shouldRestart = false;
        this.onError(errorMessage);
        this.onStop();
        break;
      case 'network':
        errorMessage = 'Network error occurred. Speech recognition requires an internet connection.';
        this.isListening = false;
        this.shouldRestart = false;
        this.onError(errorMessage);
        this.onStop();
        break;
      case 'aborted':
        // Intentional abort — don't treat as error, but stop if we should
        if (!this.shouldRestart) {
          this.isListening = false;
          this.onStop();
        }
        break;
      default:
        errorMessage = `Speech recognition error: ${event.error}`;
        this.isListening = false;
        this.shouldRestart = false;
        this.onError(errorMessage);
        this.onStop();
    }
  }

  private handleEnd(): void {
    if (this.shouldRestart && this.isListening) {
      // Recognition ended unexpectedly (browser timeout, silence, etc.) — restart
      this.tryRestart();
    } else {
      // Intentional stop
      this.isListening = false;
      this.onStop();
    }
  }

  private tryRestart(): void {
    if (this.restartAttempts >= VoiceInputService.MAX_RESTART_ATTEMPTS) {
      this.isListening = false;
      this.shouldRestart = false;
      this.onError('Microphone timed out. Please click the mic button to restart.');
      this.onStop();
      return;
    }

    this.restartAttempts++;
    setTimeout(() => {
      if (this.shouldRestart && this.isListening && this.recognition) {
        try {
          this.recognition.start();
        } catch {
          // If start fails, try stop-then-start
          try {
            this.recognition.stop();
          } catch {}
          setTimeout(() => {
            if (this.shouldRestart && this.isListening && this.recognition) {
              try {
                this.recognition.start();
              } catch {
                this.isListening = false;
                this.shouldRestart = false;
                this.onError('Failed to restart microphone');
                this.onStop();
              }
            }
          }, 300);
        }
      }
    }, 300);
  }

  destroy(): void {
    this.stopListening();
    this.recognition = null;
  }
}
