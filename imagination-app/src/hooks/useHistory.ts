import { useState, useCallback } from 'react';
import type { HistoryItem, GeneratedContent, GenerationMode } from '../types';

const HISTORY_KEY = 'imagination_history';
const MAX_HISTORY = 20;

function resizeThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(''); return; }
      const aspect = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (aspect > 1) { sx = (img.width - img.height) / 2; sw = img.height; }
      else { sy = (img.height - img.width) / 2; sh = img.width; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = useCallback(async (
    story: string,
    mode: GenerationMode,
    content: GeneratedContent
  ) => {
    let thumbnailBase64 = '';
    if (content.images?.[0]) {
      thumbnailBase64 = await resizeThumbnail(content.images[0]);
    } else if (content.chapters?.[0]?.imageUrl) {
      thumbnailBase64 = await resizeThumbnail(content.chapters[0].imageUrl);
    }

    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      story,
      mode,
      thumbnailBase64,
      fullData: content,
    };

    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // localStorage full - remove oldest items
        const trimmed = [item, ...prev].slice(0, 10);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed)); } catch {}
        return trimmed;
      }
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, saveToHistory, removeFromHistory, clearHistory };
}
