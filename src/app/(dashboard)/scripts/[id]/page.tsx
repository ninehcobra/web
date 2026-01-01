'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetScriptsQuery } from '@/data/api/scriptsApi';
import { useGenerateVideoPromptMutation } from '@/data/api/videosApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';

export default function ScriptDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    // Fetch all scripts to find one (inefficient but works for small app) - better to have getScriptById endpoint
    const { data: scripts } = useGetScriptsQuery(user?.id ?? '', { skip: !user });
    const script = scripts?.find(s => s.id === params.id);

    const [generatePrompt, { isLoading: isPromptLoading }] = useGenerateVideoPromptMutation();
    const [videoPrompt, setVideoPrompt] = useState<string | null>(null);

    if (!script) return <div>Loading script...</div>;

    const handleTTS = () => {
        alert('TTS Audio generated! (Mock)');
    };

    const handleGeneratePrompt = async () => {
        try {
            const result = await generatePrompt({ scriptContent: script.content }).unwrap();
            setVideoPrompt(result);
        } catch (error) {
            console.error(error);
            alert('Failed to generate prompt');
        }
    };

    const handleCopyPrompt = () => {
        if (videoPrompt) navigator.clipboard.writeText(videoPrompt);
        alert('Copied to clipboard!');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={{ marginBottom: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                ← Back to Scripts
            </button>

            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <h1 className={styles.title}>{script.title}</h1>
                <div style={{
                    background: 'var(--surface-hover)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '1.5rem',
                    color: 'var(--text-secondary)'
                }}>
                    {script.content}
                </div>

                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                    <button onClick={handleTTS} className={styles.button} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                        🔊 Generate Audio (TTS)
                    </button>

                    <button
                        onClick={handleGeneratePrompt}
                        disabled={isPromptLoading}
                        className={styles.button}
                        style={{ flex: 1 }}
                    >
                        {isPromptLoading ? 'Generating Prompt...' : '🎨 Generate Video Prompt'}
                    </button>
                </div>
            </div>

            {videoPrompt && (
                <div className={styles.card} style={{ borderColor: 'var(--secondary)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>AI Video Prompt</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Use this prompt in tools like Sora, Runway Gen-2, or Pika to create your video.
                    </p>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontFamily: 'monospace'
                    }}>
                        {videoPrompt}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handleCopyPrompt} className={styles.button} style={{ background: 'var(--surface)', border: '1px solid var(--text-secondary)' }}>
                            Copy Prompt
                        </button>
                        <button
                            onClick={() => router.push(`/videos/upload?scriptId=${script.id}`)}
                            className={styles.button}
                            style={{ background: 'var(--secondary-gradient)' }}
                        >
                            Upload Generated Video
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
