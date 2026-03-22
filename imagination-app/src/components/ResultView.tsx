import { Heart, RefreshCw } from 'lucide-react';
import type { GeneratedContent } from '../types';
import ImageGallery from './ImageGallery';
import StoryBook from './StoryBook';
import InteractiveScene from './InteractiveScene';
import DownloadButton from './DownloadButton';

interface Props {
  content: GeneratedContent;
  story: string;
  onSave: () => void;
  onReset: () => void;
  isSaved?: boolean;
}

const MODE_TITLES: Record<string, string> = {
  image: '🎨 마법 그림',
  storybook: '📖 동화책',
  interactive: '✨ 신기한 세계',
};

export default function ResultView({ content, story, onSave, onReset, isSaved }: Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-xl font-bold">{MODE_TITLES[content.mode]}</h2>
          <p className="text-white/50 text-sm mt-0.5 line-clamp-1">"{story}"</p>
        </div>
      </div>

      {/* Content */}
      <div className="interactive-scene-capture">
        {content.mode === 'image' && content.images && (
          <ImageGallery images={content.images} />
        )}
        {content.mode === 'storybook' && content.chapters && (
          <StoryBook chapters={content.chapters} />
        )}
        {content.mode === 'interactive' && content.interactiveScene && (
          <InteractiveScene scene={content.interactiveScene} />
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
              isSaved
                ? 'bg-red-500/30 border border-red-400/30 text-red-200'
                : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? '저장됨' : '저장'}
          </button>
          <DownloadButton content={content} story={story} />
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-lavender/30 to-mint/30 hover:from-lavender/50 hover:to-mint/50 border border-lavender/30 rounded-2xl text-white transition-all duration-200 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          다시 만들기
        </button>
      </div>
    </div>
  );
}
