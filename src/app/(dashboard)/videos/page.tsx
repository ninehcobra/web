'use client';

import { useGetVideosQuery, useDeleteVideoMutation } from '@/data/api/videosApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';
import Link from 'next/link';

export default function VideosPage() {
    const { user } = useAppSelector((state) => state.auth);
    const { data: videos, isLoading } = useGetVideosQuery(user?.id ?? '', { skip: !user });
    const [deleteVideo] = useDeleteVideoMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Delete this video?')) {
            await deleteVideo(id);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title} style={{ margin: 0 }}>My Videos</h1>
                <Link href="/videos/upload" className={styles.button} style={{ width: 'auto', textDecoration: 'none' }}>
                    📤 Upload Video
                </Link>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading videos...</div>
            ) : videos?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                    <p>No videos uploaded yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {videos?.map((video) => (
                        <div key={video.id} className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', width: '100%', paddingTop: '177%' /* 9:16 Aspect Ratio */, background: '#000' }}>
                                <video
                                    src={video.video_url}
                                    controls
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: video.status === 'uploaded' ? '#10b981' : 'var(--surface-hover)', color: video.status === 'uploaded' ? 'black' : 'var(--text-secondary)' }}>
                                        {video.status.toUpperCase()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <button className={styles.button} style={{ fontSize: '0.875rem', padding: '0.5rem' }}>
                                    Post to TikTok (Mock)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
