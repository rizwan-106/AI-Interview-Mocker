import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY1;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function genAI(prompt) {
  // const prompt = `jobTitle: ${jobTitle}, company: ${company}, jobDescription: ${jobDescription}, skills: ${skills}, difficultyLevel: ${difficulty}, experience: ${experience}. Based on this information, generate five interview questions and answers in JSON format. Use fields "question" and "answer".`;
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
