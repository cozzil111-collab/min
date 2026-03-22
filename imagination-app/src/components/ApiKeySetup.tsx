import { useState } from 'react';
import { Key, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { validateApiKey } from '../utils/geminiClient';

interface Props {
  onKeySet: (key: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export default function ApiKeySetup({ onKeySet, isModal, onClose }: Props) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('API Key를 입력해주세요 🔑');
      return;
    }
    setIsValidating(true);
    setError('');
    try {
      await validateApiKey(key.trim());
      sessionStorage.setItem('gemini_api_key', key.trim());
      onKeySet(key.trim());
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('API key') || msg.includes('INVALID_ARGUMENT')) {
        setError('API Key가 올바르지 않아요. 다시 확인해주세요 🔑');
      } else if (msg.includes('quota')) {
        setError('사용 한도를 초과했어요. 잠시 후 다시 시도해주세요 😴');
      } else {
        setError('연결에 문제가 있어요. 인터넷을 확인해주세요 🌈');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const content = (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md mx-auto shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce-gentle">🪄</div>
        <h1 className="text-3xl font-bold text-white mb-2">상상 동화 마법사</h1>
        <p className="text-white/80 text-sm">
          아이의 이야기를 마법 같은 그림과 동화로 만들어드려요
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
        <p className="text-white/70 text-xs leading-relaxed">
          🔒 API Key는 이 기기에만 임시 저장되며, 외부로 전송되지 않아요.
          <br />
          Google AI Studio에서 무료로 발급받을 수 있어요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Gemini API Key를 입력하세요"
            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/30 text-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors min-h-0 min-w-0"
          >
            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/20 border border-red-400/30 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isValidating || !key.trim()}
          className="w-full py-4 bg-gradient-to-r from-lavender to-lavender-dark rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isValidating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              확인 중이에요...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              마법 시작하기 ✨
            </>
          )}
        </button>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-white/60 hover:text-white transition-colors text-sm"
          >
            취소
          </button>
        )}
      </form>

      <div className="mt-6 text-center">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lavender hover:text-white text-sm transition-colors underline underline-offset-2"
        >
          API Key 발급받기 →
        </a>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="stars-layer-1" />
      <div className="stars-layer-2" />
      <div className="relative z-10 w-full">
        {content}
      </div>
    </div>
  );
}
