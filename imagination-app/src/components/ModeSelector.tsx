import type { GenerationMode } from '../types';

interface ModeInfo {
  id: GenerationMode;
  emoji: string;
  title: string;
  description: string;
  borderColor: string;
  selectedBg: string;
}

const MODES: ModeInfo[] = [
  {
    id: 'image',
    emoji: '🎨',
    title: '마법 그림',
    description: '이야기 장면을 멋진 그림 4장으로 만들어요',
    borderColor: 'border-violet-300',
    selectedBg: 'bg-violet-50',
  },
  {
    id: 'storybook',
    emoji: '📖',
    title: '동화책',
    description: '이야기를 동화 글과 삽화가 있는 책으로 만들어요',
    borderColor: 'border-emerald-300',
    selectedBg: 'bg-emerald-50',
  },
  {
    id: 'interactive',
    emoji: '✨',
    title: '신기한 세계',
    description: '이야기 속 세계를 살아있는 장면으로 만들어요',
    borderColor: 'border-orange-300',
    selectedBg: 'bg-orange-50',
  },
];

interface Props {
  selected: GenerationMode;
  onSelect: (mode: GenerationMode) => void;
  disabled?: boolean;
}

export default function ModeSelector({ selected, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => !disabled && onSelect(mode.id)}
          disabled={disabled}
          className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100 ${
            selected === mode.id
              ? `${mode.borderColor} ${mode.selectedBg} shadow-md`
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {selected === mode.id && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          <div className="text-4xl mb-3">{mode.emoji}</div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">{mode.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{mode.description}</p>
        </button>
      ))}
    </div>
  );
}
