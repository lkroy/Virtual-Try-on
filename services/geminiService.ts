import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVirtualTryOn = async (
    personImage: ImageFile,
    clothingImage: ImageFile,
    prompt: string
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: personImage.base64,
                            mimeType: personImage.mimeType,
                        },
                    },
                    {
                        inlineData: {
                            data: clothingImage.base64,
                            mimeType: clothingImage.mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.promptFeedback?.blockReason) {
            throw new Error(`Request was blocked. Reason: ${response.promptFeedback.blockReason}`);
        }

        const candidate = response.candidates?.[0];
        if (!candidate) {
            throw new Error("API returned no candidates in the response.");
        }

        const imagePart = candidate.content?.parts?.find(part => part.inlineData);

        if (imagePart?.inlineData) {
            const { data, mimeType } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
        
        const textPart = candidate.content?.parts?.find(part => part.text);
        if (textPart?.text) {
            throw new Error(`Model returned text instead of an image: ${textPart.text}`);
        }

        throw new Error("No image was generated in the response. The response may be empty or in an unexpected format.");

    } catch (error) {
        console.error("Error generating virtual try-on:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                 throw new Error('The API key is not valid. Please check your configuration.');
            }
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the image.");
    }
};
