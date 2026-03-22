import { useState, useRef, useCallback } from 'react';
import type { GenerationMode, GeneratedContent } from '../types';
import {
  generateStoryImage,
  generateStoryText,
  generateInteractiveScene,
} from '../utils/geminiClient';
import { buildImagePrompt, buildSceneVariantPrompt } from '../utils/promptBuilder';

const LOADING_MESSAGES = [
  '마법을 부리고 있어요... ✨',
  '상상이 그림이 되고 있어요... 🎨',
  '동화나라로 여행 중이에요... 🌙',
  '구름 위를 날고 있어요... ☁️',
  '거의 다 됐어요... 🌈',
];

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingMessages = useCallback(() => {
    let idx = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    msgIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[idx]);
    }, 1500);
  }, []);

  const stopLoadingMessages = useCallback(() => {
    if (msgIntervalRef.current) {
      clearInterval(msgIntervalRef.current);
      msgIntervalRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    stopLoadingMessages();
    setIsLoading(false);
    setError('생성이 취소됐어요. 다시 만들어볼까요? 🌟');
  }, [stopLoadingMessages]);

  const generate = useCallback(async (
    apiKey: string,
    story: string,
    mode: GenerationMode
  ): Promise<GeneratedContent | null> => {
    setIsLoading(true);
    setError(null);
    abortRef.current = new AbortController();
    startLoadingMessages();

    try {
      let content: GeneratedContent;

      if (mode === 'image') {
        const prompts = [0, 1, 2, 3].map((i) => buildSceneVariantPrompt(story, i));
        const images = await Promise.all(
          prompts.map((p) => generateStoryImage(apiKey, p))
        );
        content = { mode, images, timestamp: Date.now() };
      } else if (mode === 'storybook') {
        const chapters = await generateStoryText(apiKey, story);
        const chaptersWithImages = await Promise.all(
          chapters.map(async (ch) => ({
            ...ch,
            imageUrl: await generateStoryImage(apiKey, ch.imagePrompt || buildImagePrompt(ch.title)),
          }))
        );
        content = { mode, chapters: chaptersWithImages, timestamp: Date.now() };
      } else {
        const interactiveScene = await generateInteractiveScene(apiKey, story);
        content = { mode, interactiveScene, timestamp: Date.now() };
      }

      return content;
    } catch (err: any) {
      if (err?.name === 'AbortError') return null;
      const msg = err?.message ?? '';
      if (msg.includes('API key')) {
        setError('API Key가 올바르지 않아요. 설정에서 다시 확인해주세요 🔑');
      } else if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        setError('오늘 마법을 너무 많이 썼어요 😴 내일 다시 해봐요!');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('인터넷 연결을 확인해주세요 🌈');
      } else {
        setError('마법이 잠깐 쉬고 있어요 🌙 다시 시도해볼까요?');
      }
      return null;
    } finally {
      stopLoadingMessages();
      setIsLoading(false);
    }
  }, [startLoadingMessages, stopLoadingMessages]);

  return { generate, cancel, isLoading, loadingMessage, error, setError };
}
