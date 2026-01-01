export interface Account {
    id: string;
    user_id: string;
    platform: string;
    username: string;
    nickname?: string;
    avatar_url?: string;
    cookies?: string; // Encrypted in real app
    status: 'active' | 'potential_ban' | 'banned';
    created_at: string;
}

export interface IAccountRepository {
    getAccounts(userId: string): Promise<Account[]>;
    addAccount(account: Partial<Account>): Promise<Account>;
    deleteAccount(id: string): Promise<void>;
}
