export interface ITTSService {
    generateAudio(text: string, voice?: string): Promise<Blob>;
}
