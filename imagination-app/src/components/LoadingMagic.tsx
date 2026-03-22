import { Square } from 'lucide-react';

interface Props {
  message: string;
  onCancel: () => void;
}

export default function LoadingMagic({ message, onCancel }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Floating magic elements */}
      <div className="relative w-48 h-48">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-bounce-gentle z-10">
          🪄
        </div>
        <div
          className="absolute w-full h-full"
          style={{ animation: 'spin 4s linear infinite' }}
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl animate-twinkle">⭐</span>
        </div>
        <div
          className="absolute w-full h-full"
          style={{ animation: 'spin 6s linear infinite reverse' }}
        >
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl animate-twinkle" style={{ animationDelay: '0.5s' }}>✨</span>
        </div>
        <div
          className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'spin 5s linear infinite' }}
        >
          <span className="absolute top-0 right-0 text-lg animate-twinkle" style={{ animationDelay: '1s' }}>🌟</span>
        </div>
        <div className="absolute -top-4 -left-4 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>☁️</div>
        <div className="absolute -bottom-4 -right-4 text-2xl animate-float-slow" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-0 right-0 text-xl animate-float" style={{ animationDelay: '0.3s' }}>🌙</div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <p className="text-gray-900 text-xl font-medium animate-fade-in" key={message}>
          {message}
        </p>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-violet-400 rounded-full"
              style={{
                animation: 'bounceGentle 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-400 via-emerald-400 to-orange-400 rounded-full"
          style={{ animation: 'progressBar 3s ease-in-out infinite' }}
        />
      </div>

      <button
        onClick={onCancel}
        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm shadow-sm"
      >
        <Square className="w-4 h-4" />
        멈추기
      </button>

      <style>{`
        @keyframes progressBar {
          0% { width: 5%; }
          50% { width: 75%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
}
