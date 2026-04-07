import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Helper to get the AI instance with the latest key
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || "";
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Please configure it in the Secrets panel or .env file.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateCode(prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are an expert software engineer. Generate high-quality, clean, and efficient code based on the following request: ${prompt}. Provide explanations where necessary.`,
    config: {
      temperature: 0.2,
    }
  });
  return response.text;
}

export async function generateExpert(prompt: string, mode: string = 'general') {
  const ai = getAI();
  let systemInstruction = "You are a world-class expert. Provide a deep, analytical, and highly detailed response using the latest available information.";
  
  if (mode === 'codeArchitect') {
    systemInstruction = "You are a Senior Code Architect. Design robust, scalable, and efficient software architectures. Provide diagrams in mermaid if possible and detailed technical specifications.";
  } else if (mode === 'scientificResearcher') {
    systemInstruction = "You are a Lead Scientific Researcher. Provide evidence-based analysis, cite potential sources, and explain complex concepts with scientific rigor.";
  } else if (mode === 'strategicAnalyst') {
    systemInstruction = "You are a Strategic Business Analyst. Provide market insights, SWOT analysis, and long-term strategic recommendations.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.4,
      tools: [{ googleSearch: {} }],
    }
  });
  
  let text = response.text || "";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && chunks.length > 0) {
    text += "\n\n---\n**Fuentes y Referencias:**\n";
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
      }
    });
  }
  
  return text;
}

export async function generateImage(prompt: string, quality: string = 'standard', aspectRatio: string = '1:1', style: string = 'realistic') {
  const ai = getAI();
  const qualityPrompt = quality === '4k' ? 'ultra high resolution, 4k, highly detailed' : quality === '8k' ? 'masterpiece, 8k, extreme detail, photorealistic' : 'standard quality';
  const fullPrompt = `${style} style, ${qualityPrompt}: ${prompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function generalChat(message: string, mode: string = 'fast') {
  const ai = getAI();
  let model = "gemini-3-flash-preview";
  let tools: any[] = [];
  let systemInstruction = "You are a helpful AI assistant.";

  if (mode === 'deepSearch') {
    tools = [{ googleSearch: {} }];
    systemInstruction = "You are a research assistant. Use Google Search to provide accurate and up-to-date information.";
  } else if (mode === 'creative') {
    systemInstruction = "You are a creative writer. Provide imaginative, engaging, and expressive content.";
  } else if (mode === 'technical') {
    systemInstruction = "You are a technical expert. Provide precise, formal, and detailed technical explanations.";
  } else if (mode === 'preview') {
    systemInstruction = "You are a UI/UX expert. Provide feedback and code snippets for web interfaces.";
  }

  const response = await ai.models.generateContent({
    model,
    contents: message,
    config: {
      systemInstruction,
      tools: tools.length > 0 ? tools : undefined,
    }
  });
  return response.text;
}

export async function summarizeText(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following text concisely and highlight the key points:\n\n${text}`,
  });
  return response.text;
}

export async function translateText(text: string, targetLang: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text to ${targetLang}. Keep the tone natural and accurate:\n\n${text}`,
  });
  return response.text;
}

export async function checkGrammar(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Correct the grammar and spelling of the following text. Provide the corrected version and a brief list of changes:\n\n${text}`,
  });
  return response.text;
}

export async function formatCode(code: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Format the following code to be clean and readable. Identify the language and apply standard conventions:\n\n${code}`,
  });
  return response.text;
}

export async function convertUnits(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Perform the unit conversions requested in the following text. Provide clear results:\n\n${text}`,
  });
  return response.text;
}

export async function generatePassword(length: number = 16) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a strong, secure password of ${length} characters including uppercase, lowercase, numbers, and symbols. Only output the password.`,
  });
  return response.text;
}

export async function validateJson(json: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Validate the following JSON string. If it's valid, format it. If not, explain the errors:\n\n${json}`,
  });
  return response.text;
}

export async function testRegex(regex: string, text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Test the following regular expression: "${regex}" against this text: "${text}". List all matches and explain what the regex does.`,
  });
  return response.text;
}

export async function generateLorem(count: number = 3) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} paragraphs of Lorem Ipsum placeholder text.`,
  });
  return response.text;
}

export async function textToSpeechHint(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a phonetic transcription and reading guide for the following text to help with pronunciation:\n\n${text}`,
  });
  return response.text;
}
