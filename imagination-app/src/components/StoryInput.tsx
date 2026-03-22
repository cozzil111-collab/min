import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

const PLACEHOLDERS = [
  '용이 사는 구름나라 이야기를 해줘...',
  '내 고양이가 마법사야...',
  '우주에 사는 친구를 만났어...',
  '무지개 다리를 건너는 토끼가 있어...',
  '바닷속에 사는 인어공주를 만났어...',
  '하늘을 나는 코끼리가 있어...',
];

const MAX_LENGTH = 500;

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function StoryInput({ value, onChange, onSubmit, disabled }: Props) {
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);
  const placeholderIdxRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      placeholderIdxRef.current = (placeholderIdxRef.current + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[placeholderIdxRef.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('이 브라우저에서는 음성 입력이 지원되지 않아요 😔');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setSpeechError('');
    const rec = new SpeechRecognition();
    rec.lang = 'ko-KR';
    rec.continuous = true;
    rec.interimResults = true;

    let finalTranscript = value;

    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      onChange((finalTranscript + interim).slice(0, MAX_LENGTH));
    };

    rec.onerror = () => {
      setSpeechError('음성 인식에 문제가 생겼어요. 마이크 권한을 확인해주세요 🎤');
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      onChange(finalTranscript.slice(0, MAX_LENGTH));
    };

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const remaining = MAX_LENGTH - value.length;
  const isNearLimit = remaining <= 50;

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={placeholder}
          disabled={disabled}
          rows={5}
          className="w-full p-5 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20 resize-none transition-all duration-200 disabled:opacity-50"
          style={{ fontSize: '20px', lineHeight: '1.6' }}
        />
        <button
          type="button"
          onClick={toggleSpeech}
          disabled={disabled}
          className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all duration-200 min-h-0 min-w-0 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
          }`}
          title={isListening ? '음성 입력 중지' : '음성으로 이야기하기'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {isListening && (
        <div className="flex items-center gap-2 text-red-300 text-sm animate-pulse">
          <span className="w-2 h-2 bg-red-400 rounded-full" />
          듣고 있어요... 이야기를 말해주세요 🎤
        </div>
      )}

      {speechError && (
        <p className="text-yellow-300 text-sm">{speechError}</p>
      )}

      <div className="flex justify-between items-center text-sm">
        <span className="text-white/40">
          {value.length > 0 ? `${value.length}자 입력됨` : '아이의 이야기를 입력하거나 말해주세요'}
        </span>
        <span className={`${isNearLimit ? 'text-yellow-300' : 'text-white/40'}`}>
          {remaining}자 남음
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="w-full py-4 bg-gradient-to-r from-peach to-peach-dark rounded-2xl text-white font-bold text-xl hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-3"
      >
        <Sparkles className="w-6 h-6" />
        마법 만들기 ✨
      </button>
    </div>
  );
}
