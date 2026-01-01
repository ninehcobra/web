import { supabase } from '@/data/supabaseClient';
import { IAccountRepository, Account } from '@/domain/entities/Account';

export class AccountRepositoryImpl implements IAccountRepository {
    async getAccounts(userId: string): Promise<Account[]> {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data as Account[];
    }

    async addAccount(account: Partial<Account>): Promise<Account> {
        const { data, error } = await supabase
            .from('accounts')
            .insert(account)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Account;
    }

    async deleteAccount(id: string): Promise<void> {
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
