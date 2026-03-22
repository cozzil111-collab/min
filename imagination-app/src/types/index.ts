export type GenerationMode = 'image' | 'storybook' | 'interactive';

export interface StoryChapter {
  title: string;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface InteractiveElement {
  type: 'cloud' | 'star' | 'tree' | 'character' | 'animal' | 'flower' | 'sun' | 'moon';
  label: string;
  color: string;
  animationType: 'float' | 'bounce' | 'spin' | 'twinkle' | 'sway';
  position: { x: number; y: number };
  size: number;
  emoji: string;
}

export interface InteractiveScene {
  title: string;
  description: string;
  backgroundColor: string;
  elements: InteractiveElement[];
  ambientText: string;
}

export interface GeneratedContent {
  mode: GenerationMode;
  images?: string[];        // Base64 data URLs
  chapters?: StoryChapter[];
  interactiveScene?: InteractiveScene;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  story: string;
  mode: GenerationMode;
  thumbnailBase64?: string;
  fullData: GeneratedContent;
}

export interface AppState {
  apiKey: string | null;
  currentStory: string;
  mode: GenerationMode;
  generatedContent: GeneratedContent | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}
