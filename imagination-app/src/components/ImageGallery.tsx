import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
}

export default function ImageGallery({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIdx(i)}
            className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 hover:scale-[1.02] transition-all duration-200 shadow-md min-h-0 min-w-0"
          >
            <img
              src={src}
              alt={`장면 ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-200 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-lg">
              장면 {i + 1}
            </div>
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors min-h-0 min-w-0"
            onClick={() => setLightboxIdx(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={images[lightboxIdx]}
            alt={`장면 ${lightboxIdx + 1}`}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`h-2 rounded-full transition-all min-h-0 min-w-0 ${
                  i === lightboxIdx ? 'bg-white w-6' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
