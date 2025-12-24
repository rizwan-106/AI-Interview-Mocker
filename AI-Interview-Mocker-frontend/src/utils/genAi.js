import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY } from "./utils";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function genAI(prompt) {
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      // model: "gemini-1.5-pro-latest",
      contents: prompt,
    });
    const text = response.text;

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleaned);
    return parsedData;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Gemini API call failed.");
  }
}

export default genAI;
