// ============================================================
// DEADLINE GUARDIAN AI — Voice Interface Component
// ============================================================
'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2, Sparkles } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
  aiResponse?: string;
}

export default function VoiceInterface({ onTranscript, isProcessing, aiResponse }: VoiceInterfaceProps) {
  const { isListening, voiceTranscript, startListening, stopListening, speak } = useVoice();
  const [localTranscript, setLocalTranscript] = useState('');

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setLocalTranscript('');
      startListening((final) => {
        setLocalTranscript(final);
        onTranscript(final);
      });
    }
  }, [isListening, startListening, stopListening, onTranscript]);

  const handleSpeak = () => {
    if (aiResponse) speak(aiResponse);
  };

  const displayText = voiceTranscript || localTranscript;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main Mic Button */}
      <div className="relative">
        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-guardian-blue"
            />
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-guardian-blue"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          disabled={isProcessing}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-all ${
            isListening
              ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
              : isProcessing
              ? 'bg-guardian-blue/50 cursor-not-allowed'
              : 'bg-guardian-blue hover:bg-guardian-blue-light shadow-[0_0_30px_rgba(37,99,235,0.5)]'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      {/* Status text */}
      <div className="text-center">
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-400 text-sm font-medium"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            Listening... speak now
          </motion.div>
        )}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-guardian-blue text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI is thinking...
          </motion.div>
        )}
        {!isListening && !isProcessing && (
          <p className="text-guardian-muted text-sm">Tap to speak with your AI Chief-of-Staff</p>
        )}
      </div>

      {/* Live transcript */}
      <AnimatePresence>
        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md bg-guardian-card rounded-xl p-4 border border-guardian-border"
          >
            <p className="text-xs text-guardian-muted mb-1 font-mono">YOU SAID:</p>
            <p className="text-guardian-text text-sm italic">"{displayText}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-guardian-blue/10 rounded-xl p-4 border border-guardian-blue/30"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-guardian-blue font-mono font-bold">GUARDIAN AI:</p>
              <button
                onClick={handleSpeak}
                className="text-guardian-muted hover:text-guardian-blue transition-colors"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-guardian-text text-sm leading-relaxed">{aiResponse}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
