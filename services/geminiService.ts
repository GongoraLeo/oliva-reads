
import { GoogleGenAI, Type } from "@google/genai";
import { Book, BookRecommendation } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getBookRecommendations = async (readBooks: Book[]): Promise<BookRecommendation[]> => {
  if (!process.env.API_KEY) {
    throw new Error("La clave de API no está configurada.");
  }

  const bookList = readBooks.map(book => `- "${book.title}" por ${book.author.name}`).join('\n');

  const prompt = `
    Soy un usuario de una aplicación de diario de lectura. Basado en los siguientes libros que he leído y valorado positivamente, por favor, recomiéndame tres libros nuevos.

    Mis libros leídos:
    ${bookList}

    Para cada recomendación, proporciona el título del libro, el nombre del autor y una razón breve y convincente (una frase) de por qué podría gustarme, basada en mi historial de lectura.
  `;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["title", "author", "reason"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    return result.recommendations as BookRecommendation[];
  } catch (error) {
    console.error("Error getting book recommendations from Gemini:", error);
    // Return a fallback or throw the error
    throw new Error("No se pudieron obtener las recomendaciones.");
  }
};