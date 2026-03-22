import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { GeneratedContent } from '../types';

interface Props {
  content: GeneratedContent;
  story: string;
}

export default function DownloadButton({ content, story }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);

      if (content.mode === 'image' && content.images?.length) {
        for (let i = 0; i < content.images.length; i++) {
          await downloadImage(content.images[i], `동화_장면${i + 1}_${timestamp}.jpg`);
          await new Promise((r) => setTimeout(r, 200));
        }
      } else if (content.mode === 'storybook' && content.chapters?.length) {
        for (let i = 0; i < content.chapters.length; i++) {
          const ch = content.chapters[i];
          if (ch.imageUrl) {
            await downloadImage(ch.imageUrl, `동화_${ch.title}_${timestamp}.jpg`);
            await new Promise((r) => setTimeout(r, 200));
          }
        }
        const textContent = content.chapters
          .map((ch) => `[${ch.title}]\n${ch.content}`)
          .join('\n\n');
        const blob = new Blob([`${story}\n\n${textContent}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        await downloadImage(url, `동화책_${timestamp}.txt`);
        URL.revokeObjectURL(url);
      } else if (content.mode === 'interactive' && content.interactiveScene) {
        const { default: html2canvas } = await import('html2canvas');
        const sceneEl = document.querySelector('.interactive-scene-capture') as HTMLElement;
        if (sceneEl) {
          const canvas = await html2canvas(sceneEl, { useCORS: true, scale: 2 });
          const dataUrl = canvas.toDataURL('image/png');
          await downloadImage(dataUrl, `신기한세계_${timestamp}.png`);
        } else {
          const sc = content.interactiveScene;
          const text = `${sc.title}\n\n${sc.description}\n\n등장 요소:\n${sc.elements.map((e) => `${e.emoji} ${e.label}`).join('\n')}`;
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          await downloadImage(url, `신기한세계_${timestamp}.txt`);
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 shadow-sm"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isDownloading ? '저장 중...' : '다운로드'}
    </button>
  );
}
