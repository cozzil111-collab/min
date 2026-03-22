import { X, Trash2, Clock } from 'lucide-react';
import type { HistoryItem, GenerationMode } from '../types';

const MODE_LABELS: Record<GenerationMode, string> = {
  image: '🎨 마법 그림',
  storybook: '📖 동화책',
  interactive: '✨ 신기한 세계',
};

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

export default function HistoryPanel({ history, onSelect, onRemove, onClear, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1a1a3e] to-[#2d1b69] border-l border-white/10 flex flex-col h-full animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-lavender" />
            <h2 className="text-white font-bold text-lg">만든 이야기들</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-white/40 hover:text-red-300 transition-colors text-sm min-h-0 min-w-0 px-2 py-1"
                title="모두 삭제"
              >
                모두 지우기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors min-h-0 min-w-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
              <span className="text-5xl animate-bounce-gentle">📚</span>
              <p className="text-white/50 text-sm">아직 만든 이야기가 없어요.</p>
              <p className="text-white/30 text-xs">이야기를 만들면 여기에 저장돼요!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group flex gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
                  {item.thumbnailBase64 ? (
                    <img src={item.thumbnailBase64} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">
                      {item.mode === 'image' ? '🎨' : item.mode === 'storybook' ? '📖' : '✨'}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-xs mb-1">{MODE_LABELS[item.mode]}</p>
                  <p className="text-white text-sm font-medium truncate">{item.story}</p>
                  <p className="text-white/30 text-xs mt-1">{timeAgo(item.timestamp)}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-300 transition-all min-h-0 min-w-0 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">
            최근 {history.length}/20개 · 기기에만 저장됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
