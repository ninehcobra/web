'use client';

import { useGetScriptsQuery, useDeleteScriptMutation } from '@/data/api/scriptsApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

export default function ScriptsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const { data: scripts, isLoading } = useGetScriptsQuery(user?.id ?? '', { skip: !user });
    const [deleteScript] = useDeleteScriptMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Delete this script?')) {
            await deleteScript(id);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title} style={{ margin: 0 }}>My Scripts</h1>
                <Link href="/scripts/create" className={styles.button} style={{ width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FontAwesomeIcon icon={faPlus} /> New Script
                </Link>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading scripts...</div>
            ) : scripts?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                    <p>No scripts yet.</p>
                    <Link href="/products" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>
                        Go to Products to generate one
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {scripts?.map((script) => (
                        <div key={script.id} className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    {script.title || 'Untitled Script'}
                                </h3>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {script.style || 'Standard'}
                                    </span>
                                    <span>{new Date(script.created_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {typeof script.content === 'string' && script.content.startsWith('{')
                                        ? JSON.parse(script.content).hook // Try to peek content if JSON
                                        : script.content.substring(0, 100)}...
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <Link href={`/scripts/${script.id}`} className={styles.button} style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', padding: '0.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <FontAwesomeIcon icon={faFolderOpen} /> Open
                                </Link>
                                <button
                                    onClick={() => handleDelete(script.id)}
                                    style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
