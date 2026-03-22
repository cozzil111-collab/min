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
          <h2 className="text-gray-900 text-xl font-bold">{MODE_TITLES[content.mode]}</h2>
          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">"{story}"</p>
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
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-200 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
              isSaved
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? '저장됨' : '저장'}
          </button>
          <DownloadButton content={content} story={story} />
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl text-white transition-all duration-200 text-sm font-medium hover:scale-105 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          다시 만들기
        </button>
      </div>
    </div>
  );
}
