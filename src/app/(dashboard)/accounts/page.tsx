'use client';

import { useState } from 'react';
import { useGetAccountsQuery, useAddAccountMutation, useDeleteAccountMutation } from '@/data/api/accountsApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';

export default function AccountsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const { data: accounts, isLoading } = useGetAccountsQuery(user?.id ?? '', { skip: !user });
    const [addAccount, { isLoading: isAdding }] = useAddAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();

    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState('tiktok');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !username) return;
        try {
            await addAccount({
                user_id: user.id,
                username,
                platform,
                status: 'active',
                nickname: username, // Mock
                avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`
            }).unwrap();
            setUsername('');
            alert('Account added!');
        } catch (err) {
            console.error(err);
            alert('Failed to add account');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Disconnect this account?')) {
            await deleteAccount(id);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Manage Accounts</h1>

            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Link New Account</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                        <label>Platform</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className={styles.input}
                            style={{ background: 'var(--surface-hover)' }}
                        >
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube Shorts</option>
                            <option value="instagram">Instagram Reels</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup} style={{ flex: 2 }}>
                        <label>Username (or Profile URL)</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            style={{ background: 'var(--surface-hover)' }}
                            placeholder="@username"
                            required
                        />
                    </div>

                    <button disabled={isAdding} className={styles.button} style={{ marginBottom: '2px' }}>
                        {isAdding ? 'Linking...' : 'Link Account'}
                    </button>
                </form>
            </div>

            <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Connected Accounts</h3>
                {isLoading ? (
                    <div>Loading accounts...</div>
                ) : accounts?.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>No accounts linked.</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {accounts?.map((acc) => (
                            <div key={acc.id} className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={acc.avatar_url} alt={acc.username} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{acc.nickname || acc.username}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{acc.platform} • {acc.status}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(acc.id)} style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--surface-border)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                                    Unlink
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
