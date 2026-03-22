export function buildImagePrompt(story: string): string {
  return `Create a warm, soft, child-friendly storybook illustration in a gentle watercolor style.
Scene: ${story}
Style: pastel colors, round shapes, friendly characters, no scary elements, suitable for children ages 3-10. Dreamlike and magical atmosphere.`;
}

export function buildTextPrompt(story: string): string {
  return `너는 어린이 동화 작가야. 아이가 말한 이야기를 바탕으로 짧은 동화를 써줘.
아이의 이야기: ${story}
조건:
- 3~5개의 짧은 챕터로 구성
- 각 챕터는 2~3문장
- 긍정적이고 따뜻한 결말
- 한국어로 작성
- 반드시 아래 JSON만 반환, 다른 텍스트 없이:
{"chapters":[{"title":"...","content":"...","imagePrompt":"..."}]}`;
}

export function buildInteractivePrompt(story: string): string {
  return `아이의 이야기를 바탕으로 인터랙티브 동화 장면을 만들어줘.
아이의 이야기: ${story}

아래 JSON 형식으로만 반환해줘 (다른 텍스트 없이):
{
  "title": "장면 제목",
  "description": "장면 설명 (한국어, 2-3문장)",
  "backgroundColor": "CSS gradient (예: linear-gradient(180deg, #87CEEB 0%, #98D8C8 100%))",
  "ambientText": "배경 분위기 텍스트 (짧게)",
  "elements": [
    {
      "type": "cloud|star|tree|character|animal|flower|sun|moon",
      "label": "요소 이름 (한국어)",
      "color": "CSS 색상",
      "animationType": "float|bounce|spin|twinkle|sway",
      "position": {"x": 50, "y": 30},
      "size": 60,
      "emoji": "이모지"
    }
  ]
}

elements는 5~8개, position은 x: 5~90, y: 5~80 범위로 겹치지 않게 배치.`;
}

export function buildSceneVariantPrompt(story: string, sceneIndex: number): string {
  const scenes = [
    'the opening scene, showing the beginning of the story',
    'the most exciting or magical moment',
    'a peaceful middle scene showing the journey',
    'the happy ending scene',
  ];
  const sceneDesc = scenes[sceneIndex % scenes.length];
  return buildImagePrompt(`${story} - ${sceneDesc}`);
}
