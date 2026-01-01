export interface Script {
    id: string;
    user_id: string;
    product_id?: string;
    title: string;
    content: string; // JSON string or text interface
    style?: string;
    created_at: string;
}

export interface ScriptContent {
    title: string;
    hook: string;
    scenes: {
        visual: string;
        voiceover: string;
        duration: string;
    }[];
    cta: string;
}

export interface IScriptRepository {
    getScripts(userId: string): Promise<Script[]>;
    getScriptById(id: string): Promise<Script | null>;
    createScript(script: Partial<Script>): Promise<Script>;
    deleteScript(id: string): Promise<void>;
}
