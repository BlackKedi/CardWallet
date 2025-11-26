import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedCardData } from "../types";

// Helper to convert file to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractCardInfo = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<ExtractedCardData | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `Analyze this image of a loyalty/membership card. 
            Extract the Store Name (e.g., Tesco, Costco, IKEA, HappyGo) and the Card Number/ID.
            If the store name is not visible, infer it from logos if possible, or return "Unknown Store".
            Clean up the card number (remove spaces).
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storeName: { type: Type.STRING },
            cardNumber: { type: Type.STRING }
          },
          required: ["storeName", "cardNumber"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as ExtractedCardData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};