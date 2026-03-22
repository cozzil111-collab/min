import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StoryChapter } from '../types';

interface Props {
  chapters: StoryChapter[];
}

export default function StoryBook({ chapters }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goTo = (idx: number) => {
    setDirection(idx > currentPage ? 'right' : 'left');
    setCurrentPage(idx);
  };

  const chapter = chapters[currentPage];
  if (!chapter) return null;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Book spread */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl overflow-hidden border border-orange-200 shadow-md">
        {/* Page number */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
          <span className="text-gray-500 text-xs bg-white/80 px-3 py-1 rounded-full">
            {currentPage + 1} / {chapters.length}
          </span>
        </div>

        <div
          className="flex flex-col md:flex-row min-h-[320px]"
          key={currentPage}
          style={{ animation: `${direction === 'right' ? 'slideInRight' : 'slideInLeft'} 0.4s ease-out` }}
        >
          {/* Text page */}
          <div className="flex-1 p-8 flex flex-col justify-center md:border-r md:border-orange-200">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed"
              style={{ fontFamily: 'Gaegu, cursive' }}
            >
              {chapter.title}
            </h2>
            <p
              className="text-gray-800 text-lg leading-loose"
              style={{ fontFamily: 'Gaegu, cursive', fontSize: '18px' }}
            >
              {chapter.content}
            </p>
          </div>

          {/* Image page */}
          <div className="flex-1 p-4 flex items-center justify-center min-h-[200px] md:min-h-0">
            {chapter.imageUrl ? (
              <img
                src={chapter.imageUrl}
                alt={chapter.title}
                className="w-full h-full max-h-64 md:max-h-80 object-cover rounded-2xl shadow-md"
              />
            ) : (
              <div className="w-full h-full min-h-[200px] bg-orange-100 rounded-2xl flex items-center justify-center">
                <span className="text-4xl animate-bounce-gentle">🎨</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default rounded-2xl text-gray-700 border border-gray-200 transition-all duration-200 font-medium shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          이전
        </button>

        {/* Page dots */}
        <div className="flex gap-2">
          {chapters.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 min-h-0 min-w-0 ${
                i === currentPage
                  ? 'w-8 h-3 bg-violet-500'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === chapters.length - 1}
          className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default rounded-2xl text-gray-700 border border-gray-200 transition-all duration-200 font-medium shadow-sm"
        >
          다음
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
