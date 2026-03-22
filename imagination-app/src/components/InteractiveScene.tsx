import type { InteractiveScene as InteractiveSceneType, InteractiveElement } from '../types';

interface Props {
  scene: InteractiveSceneType;
}

function getAnimation(type: InteractiveElement['animationType']): string {
  switch (type) {
    case 'float': return 'float 3s ease-in-out infinite';
    case 'bounce': return 'bounceGentle 1.5s ease-in-out infinite';
    case 'spin': return 'spin 8s linear infinite';
    case 'twinkle': return 'twinkle 2s ease-in-out infinite';
    case 'sway': return 'sway 3s ease-in-out infinite';
    default: return 'float 4s ease-in-out infinite';
  }
}

export default function InteractiveScene({ scene }: Props) {
  return (
    <div className="animate-fade-in space-y-4">
      <div
        className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
        style={{
          background: scene.backgroundColor || 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 100%)',
          minHeight: '380px',
        }}
      >
        {/* Ambient text */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <span className="text-white/80 text-sm bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {scene.ambientText}
          </span>
        </div>

        {/* Interactive elements */}
        {scene.elements.map((el, i) => (
          <div
            key={i}
            className="absolute cursor-pointer group"
            style={{
              left: `${el.position.x}%`,
              top: `${el.position.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${el.size}px`,
              animation: getAnimation(el.animationType),
              animationDelay: `${i * 0.3}s`,
              zIndex: i + 1,
            }}
            title={el.label}
          >
            <span className="select-none drop-shadow-md group-hover:scale-125 transition-transform duration-200 inline-block">
              {el.emoji}
            </span>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/20 px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {el.label}
            </span>
          </div>
        ))}

        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 rounded-b-3xl"
          style={{
            background: 'linear-gradient(transparent, rgba(0,80,0,0.2))',
          }}
        />
      </div>

      {/* Description */}
      <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
        <h3
          className="text-white text-xl font-bold mb-2"
          style={{ fontFamily: 'Gaegu, cursive' }}
        >
          {scene.title}
        </h3>
        <p
          className="text-white/80 leading-relaxed"
          style={{ fontFamily: 'Gaegu, cursive', fontSize: '17px' }}
        >
          {scene.description}
        </p>
      </div>

      {/* Touch hint */}
      <p className="text-white/40 text-xs text-center">
        각 요소에 마우스를 올리면 이름을 볼 수 있어요 ✨
      </p>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: translate(-50%, -50%) rotate(-5deg); }
          50% { transform: translate(-50%, -50%) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
