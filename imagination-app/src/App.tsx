import { useState, useCallback } from 'react';
import { Key, History, Sparkles } from 'lucide-react';
import type { GenerationMode, GeneratedContent, HistoryItem } from './types';
import { useGemini } from './hooks/useGemini';
import { useHistory } from './hooks/useHistory';
import ApiKeySetup from './components/ApiKeySetup';
import StoryInput from './components/StoryInput';
import ModeSelector from './components/ModeSelector';
import ResultView from './components/ResultView';
import LoadingMagic from './components/LoadingMagic';
import HistoryPanel from './components/HistoryPanel';

function getStoredKey(): string | null {
  return sessionStorage.getItem('gemini_api_key');
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(getStoredKey);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [story, setStory] = useState('');
  const [mode, setMode] = useState<GenerationMode>('image');
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const { generate, cancel, isLoading, loadingMessage, error, setError } = useGemini();
  const { history, saveToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleKeySet = useCallback((key: string) => {
    setApiKey(key);
    setShowApiSetup(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !story.trim()) return;
    setResult(null);
    setIsSaved(false);
    const content = await generate(apiKey, story.trim(), mode);
    if (content) setResult(content);
  }, [apiKey, story, mode, generate]);

  const handleSave = useCallback(async () => {
    if (!result || isSaved) return;
    await saveToHistory(story, mode, result);
    setIsSaved(true);
  }, [result, isSaved, story, mode, saveToHistory]);

  const handleReset = useCallback(() => {
    setResult(null);
    setIsSaved(false);
    setError(null);
  }, [setError]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setStory(item.story);
    setMode(item.mode);
    setResult(item.fullData);
    setIsSaved(true);
    setShowHistory(false);
  }, []);

  if (!apiKey) {
    return <ApiKeySetup onKeySet={handleKeySet} />;
  }

  return (
    <div className="day-sky min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-12">
        {/* Header */}
        <header className="flex items-center justify-between py-5 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce-gentle">🪄</span>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-none">상상 동화 마법사</h1>
              <p className="text-gray-500 text-xs">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="relative p-3 bg-white/60 hover:bg-white/90 rounded-2xl text-gray-700 transition-all duration-200 min-h-0 min-w-0 shadow-sm border border-purple-200/50"
              title="히스토리"
            >
              <History className="w-5 h-5" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {Math.min(history.length, 9)}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowApiSetup(true)}
              className="p-3 bg-white/60 hover:bg-white/90 rounded-2xl text-gray-700 transition-all duration-200 min-h-0 min-w-0 shadow-sm border border-purple-200/50"
              title="API Key 변경"
            >
              <Key className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="space-y-6">
          {isLoading ? (
            <LoadingMagic message={loadingMessage} onCancel={cancel} />
          ) : result ? (
            <ResultView
              content={result}
              story={story}
              onSave={handleSave}
              onReset={handleReset}
              isSaved={isSaved}
            />
          ) : (
            <>
              {/* Welcome card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-200/40 text-center shadow-sm">
                <div className="flex justify-center gap-3 text-3xl mb-3">
                  <span className="animate-float" style={{ animationDelay: '0s' }}>⭐</span>
                  <span className="animate-float" style={{ animationDelay: '0.5s' }}>🌙</span>
                  <span className="animate-float" style={{ animationDelay: '1s' }}>☁️</span>
                </div>
                <h2 className="text-gray-900 text-lg font-bold mb-1">어떤 이야기를 만들까요?</h2>
                <p className="text-gray-600 text-sm">아이의 상상을 마법 같은 동화로 만들어드려요</p>
              </div>

              {/* Story input */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-200/40 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  이야기를 들려주세요
                </h3>
                <StoryInput
                  value={story}
                  onChange={setStory}
                  onSubmit={handleGenerate}
                  disabled={isLoading}
                />
              </div>

              {/* Mode selector */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-200/40 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <span>🎭</span>
                  어떻게 만들까요?
                </h3>
                <ModeSelector selected={mode} onSelect={setMode} disabled={isLoading} />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center animate-fade-in">
                  <p className="text-gray-800 text-base">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-gray-500 hover:text-gray-800 text-sm transition-colors min-h-0 min-w-0"
                  >
                    닫기
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* API Key Modal */}
      {showApiSetup && (
        <ApiKeySetup
          onKeySet={handleKeySet}
          isModal
          onClose={() => setShowApiSetup(false)}
        />
      )}

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onRemove={removeFromHistory}
          onClear={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
