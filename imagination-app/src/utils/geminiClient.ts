import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StoryChapter, InteractiveScene } from "../types";
import { buildTextPrompt, buildInteractivePrompt } from "./promptBuilder";

export async function generateStoryImage(
  apiKey: string,
  prompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    } as any,
  });
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if ((part as any).inlineData?.mimeType?.startsWith("image/")) {
      const inlineData = (part as any).inlineData;
      return `data:${inlineData.mimeType};base64,${inlineData.data}`;
    }
  }
  throw new Error("이미지를 찾을 수 없어요.");
}

export async function generateStoryText(
  apiKey: string,
  story: string
): Promise<StoryChapter[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildTextPrompt(story);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, (m) =>
    m.replace(/```json\n?|```\n?/g, "")
  ).trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("이야기 형식 오류");
  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.chapters;
}

export async function generateInteractiveScene(
  apiKey: string,
  story: string
): Promise<InteractiveScene> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildInteractivePrompt(story);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json\n?|```\n?/g, "").trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("장면 형식 오류");
  return JSON.parse(jsonMatch[0]);
}

export async function validateApiKey(apiKey: string): Promise<void> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  await model.generateContent("안녕");
}
