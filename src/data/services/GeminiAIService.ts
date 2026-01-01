import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '@/domain/interfaces/IAIService';

export class GeminiAIService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Google AI API Key is required');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateScript(productName: string, productDescription: string, style: string = 'engaging'): Promise<string> {
        const prompt = `
      Act as a professional TikTok scriptwriter.
      Create a viral short video script for the following product:
      Product Name: ${productName}
      Description: ${productDescription}
      Style: ${style}
      
      Format the output as a valid JSON object with the following structure:
      {
        "title": "Video Title",
        "hook": "Opening hook line",
        "scenes": [
          {
            "visual": "Visual description",
            "voiceover": "Voiceover text",
            "duration": "Approximate duration in seconds"
          }
        ],
        "cta": "Call to action"
      }
      Do not include markdown code blocks, just the raw JSON.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            // Clean up markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return text;
        } catch (error) {
            console.error('Error generating script:', error);
            throw new Error('Failed to generate script');
        }
    }

    async generateVideoPrompt(scriptContent: string): Promise<string> {
        const prompt = `
      Based on the following TikTok script, generate a detailed image generation prompt that captures the overall vide and aesthetic of the product showcase.
      Script: ${scriptContent}
      
      Output a single descriptive prompt string optimized for AI image generators.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating prompt:', error);
            throw new Error('Failed to generate video prompt');
        }
    }
}
