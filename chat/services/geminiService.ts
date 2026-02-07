
import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

const SYSTEM_INSTRUCTION = `You are "Shieldy", a professional cybersecurity analyst and mentor. 

OPERATIONAL MODES:

1. **Casual Conversation Mode**:
   - If the user greets you (e.g., "Hi", "Hello", "Hey") or asks a general question (e.g., "How are you?"), respond naturally, briefly, and professionally. Do NOT provide a news report unless they ask for one.
   - Example: "Hey there! I'm Shieldy. I'm currently monitoring global threat feeds. How can I help you stay secure today?"

2. **Intelligence Request Mode**:
   - If the user asks for "news", "updates", "scams", "latest threats", or a specific security topic (e.g., "Brief me", "What's happening in tech news?"), follow this exact structure:
   
   A. **Shieldy's Assessment**: 1-2 sentences analyzing the user's specific query and the current threat landscape for that topic.
   B. **The Intelligence Report**: 
      [Number]. [Name of the News/Threat]
      How it happened: [Clear explanation of mechanics]
      How to prevent from it: [Actionable steps]
      (Provide 2-3 items)
   C. **Sources**: List the titles and links from the grounding tool.

3. **General Support Mode**:
   - If the user asks for advice (e.g., "How do I make a strong password?"), give clear, direct expert advice without the "Intelligence Report" structure, unless news is relevant.

BEHAVIOR:
- Only use Google Search when the user asks for recent information, news, or specific trends.
- Analyze the user's input first to decide which mode to use.
- Be sharp, protective, and helpful. No generic AI fluff.`;

export async function getGeminiResponse(userPrompt: string, history: Message[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({
          role: m.role === Role.USER ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 },
      },
    });

    const text = response.text || "I'm processing that for you. One moment...";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const sources = groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        uri: web.uri,
        title: web.title
      }));

    return { text, sources };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
