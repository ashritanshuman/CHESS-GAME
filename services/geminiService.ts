
import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";
import { DIFFICULTY_CONFIG } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getComputerMove = async (fen: string, difficulty: Difficulty): Promise<string> => {
  const config = DIFFICULTY_CONFIG[difficulty];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Current FEN: ${fen}. ${config.prompt}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const move = response.text?.trim() || '';
    // Clean up response in case Gemini adds extra text
    const sanMatch = move.match(/[a-zA-Z0-9+#=!-]+/);
    return sanMatch ? sanMatch[0] : '';
  } catch (error) {
    console.error("Gemini Error:", error);
    return '';
  }
};

export const getCoachAdvice = async (fen: string, lastMove: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The current chess board position is ${fen}. The last move was ${lastMove}. In 2 short, encouraging sentences, give a kid-friendly piece of advice or explain why that move was interesting.`,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || "Keep going! You're doing great!";
  } catch (error) {
    return "Nice move! What's your next plan?";
  }
};
