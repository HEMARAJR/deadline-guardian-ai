// ============================================================
// DEADLINE GUARDIAN AI — Voice Hook (Web Speech API)
// ============================================================
'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';

// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoice() {
  const { isListening, voiceTranscript, setIsListening, setVoiceTranscript } = useStore();

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Voice recognition is not supported in this browser. Try Chrome.');
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');

        setVoiceTranscript(transcript);

        if (event.results[event.results.length - 1].isFinal) {
          onResult(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [setIsListening, setVoiceTranscript]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, [setIsListening]);

  const speak = useCallback((text: string, rate = 1.0) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes('Google') || v.name.includes('Neural')
    );

    if (preferred) {
      utterance.voice = preferred;
    }

    synthRef.current.speak(utterance);
  }, []);

  const cancelSpeech = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  return {
    isListening,
    voiceTranscript,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
  };
}