import { supabase } from '@/data/supabaseClient';
import { IScriptRepository, Script } from '@/domain/entities/Script';

export class ScriptRepositoryImpl implements IScriptRepository {
    async getScripts(userId: string): Promise<Script[]> {
        const { data, error } = await supabase
            .from('scripts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data as Script[];
    }

    async getScriptById(id: string): Promise<Script | null> {
        const { data, error } = await supabase
            .from('scripts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data as Script;
    }

    async createScript(script: Partial<Script>): Promise<Script> {
        const { data, error } = await supabase
            .from('scripts')
            .insert(script)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Script;
    }

    async deleteScript(id: string): Promise<void> {
        const { error } = await supabase
            .from('scripts')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
