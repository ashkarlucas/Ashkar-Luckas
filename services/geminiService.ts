
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, WingmanResponse, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (lang: Language) => `Tu es TruthLayer, un assistant de rencontre IA cynique, hautement intelligent et éthique. 
Ton ton est spirituel, tranchant et "anti-bullshit", mais jamais toxique. Tu aides les utilisateurs à comprendre le sous-texte des profils et des messages de rencontre.
Concentre-toi sur : les traits narcissiques, les comportements génériques, les incohérences et les probabilités de ghosting.
Reste toujours objectif mais divertissant. Traite les données comme des probabilités, pas des vérités absolues.
Réponds exclusivement en ${lang === 'mg' ? 'Malagasy' : 'Français'}.`;

export const analyzeScreenshot = async (base64Image: string, lang: Language): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/png" } },
        { text: lang === 'mg' ? "Hadihadiho ity sary ity (profil na resaka) mba hitadiavana 'red flags', fahamarinana ary finiavana. Omeo isa 0 ka hatramin'ny 100 ny risika (100 no avo indrindra). Tanisao ireo 'red flags' hita." : "Analyse cette capture d'écran de profil ou de discussion pour détecter les red flags, la sincérité et les intentions. Donne un score de 0 à 100 où 100 est un risque élevé de bullshit. Liste des red flags spécifiques avec leur sévérité." }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          flags: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ["score", "summary", "flags"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getWingmanAdvice = async (base64Image: string, lang: Language, lastMessage?: string): Promise<WingmanResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/png" } },
        { text: lang === 'mg' ? `Araka ity resaka ity, manomeza valiny 3: Mahatsikaiky, Mistery, ary mivantana. Tokony hahasarika ny valiny. ${lastMessage ? `Ny hafatra farany dia: ${lastMessage}` : ""}` : `En te basant sur cette conversation/profil, génère 3 réponses : Drôle, Mystérieuse, et Directe. Garde-les engageantes et adaptées au contexte. ${lastMessage ? `Le dernier message était : ${lastMessage}` : ""}` }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          funny: { type: Type.STRING },
          mysterious: { type: Type.STRING },
          direct: { type: Type.STRING }
        },
        required: ["funny", "mysterious", "direct"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeBio = async (bioText: string, lang: Language): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: lang === 'mg' ? `Hadihadiho ity bio ity raha marina na tsia: "${bioText}"` : `Analyse cette bio d'application de rencontre pour en vérifier la sincérité et les clichés : "${bioText}"`,
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Risk score" },
          sincerityScore: { type: Type.NUMBER, description: "Sincerity score" },
          summary: { type: Type.STRING },
          cliches: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "sincerityScore", "summary", "cliches", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text);
};
