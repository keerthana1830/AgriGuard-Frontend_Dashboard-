import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, UserSettings } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { XCircleIcon, SendIcon, MicrophoneIcon, SpeakerWaveIcon } from './Icons';
import { soundService } from '../services/soundService';
import { useTranslation } from '../contexts/LanguageContext';
import { languages } from '../translations';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const langCodeMap: Record<string, string> = {
  'English': 'en-US',
  'தமிழ்': 'ta-IN',
  'हिन्दी': 'hi-IN',
  'മലയാളം': 'ml-IN',
  'ਪੰਜਾਬੀ': 'pa-IN',
  'తెలుగు': 'te-IN',
  'ಕನ್ನಡ': 'kn-IN',
};

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onUpdateSettings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const { language, setLanguage, t } = useTranslation();

  const recognitionRef = useRef<any>(null); // Using 'any' for SpeechRecognition
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSttSupported = !!SpeechRecognition;
  const isTtsSupported = 'speechSynthesis' in window;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
       setMessages([{ role: 'model', text: t('chatbot_greeting') }]);
    }
  }, [isOpen, messages.length, t]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    soundService.play('messageSend');

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const systemInstructionTemplate = t('geminiChatSystemInstruction');
      const responseText = await getChatbotResponse(input, language, newMessages.slice(0, -1), systemInstructionTemplate);
      soundService.play('messageReceive');
      setMessages([...newMessages, { role: 'model', text: responseText }]);
    } catch (error) {
      soundService.play('error');
      const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't get a response.";
      setMessages([...newMessages, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    onUpdateSettings({ language: newLang });
  };
  
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!isSttSupported) return;
      soundService.play('click');
      const recognition = new SpeechRecognition();
      recognition.lang = langCodeMap[language] || 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        // Automatically send after speech ends if there's input
        if (input.trim()) {
          setTimeout(handleSend, 100);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognition.start();
      setIsListening(true);
      recognitionRef.current = recognition;
    }
  };
  
  const handleSpeak = (text: string) => {
    if (!isTtsSupported) return;
    soundService.play('click');
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodeMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] z-30 bg-surface rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/20 bg-primary rounded-t-2xl text-white">
        <div>
          <h3 className="text-lg font-bold">{t('chatbot_title')}</h3>
        </div>
        <div className="flex items-center gap-2">
            <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-primary-dark border border-green-200 text-white text-sm rounded-lg focus:ring-green-300 focus:border-green-300 block w-full p-1.5"
            >
              {Object.keys(languages).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button onClick={onClose} className="hover:text-gray-200">
                <XCircleIcon className="w-8 h-8" />
            </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-background">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${
                  msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-slate-600 text-text-primary rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'model' && isTtsSupported && (
                 <button onClick={() => handleSpeak(msg.text)} className="p-1 text-text-secondary hover:text-primary mt-1" aria-label="Read message aloud">
                    <SpeakerWaveIcon className="w-5 h-5"/>
                 </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-slate-600 text-text-primary rounded-bl-none">
                 <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse-fast"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse-fast animation-delay-150ms"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse-fast animation-delay-300ms"></span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <footer className="p-4 border-t border-gray-200 dark:border-slate-700 bg-surface rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? t('chatbot_placeholder_listening') : t('chatbot_placeholder_ask')}
            className="w-full px-4 py-2 border bg-background border-gray-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading || isListening}
          />
          {isSttSupported && (
            <button
                onClick={handleListen}
                disabled={isLoading}
                className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 ${isListening ? 'text-red-500 animate-pulse' : 'text-text-secondary'}`}
            >
                <MicrophoneIcon className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </footer>
       <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        .animation-delay-150ms {
            animation-delay: 150ms;
        }
        .animation-delay-300ms {
            animation-delay: 300ms;
        }
        @keyframes pulse-fast {
          50% { opacity: .5; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
