export interface IAIService {
    generateScript(productName: string, productDescription: string, style?: string): Promise<string>;
    generateVideoPrompt(scriptContent: string): Promise<string>;
}
