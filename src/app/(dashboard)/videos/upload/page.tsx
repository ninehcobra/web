'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUploadVideoFileMutation, useSaveVideoMutation } from '@/data/api/videosApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';

function UploadVideoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scriptId = searchParams.get('scriptId');
    const { user } = useAppSelector((state) => state.auth);

    const [file, setFile] = useState<File | null>(null);
    const [uploadVideo, { isLoading: isUploading }] = useUploadVideoFileMutation();
    const [saveVideo, { isLoading: isSaving }] = useSaveVideoMutation();

    const handleUpload = async () => {
        if (!file || !user) return;

        try {
            // 1. Upload File
            const { data: publicUrl, error: uploadError } = await uploadVideo({ file, userId: user.id });
            if (uploadError || !publicUrl) throw new Error('Upload failed');

            // 2. Create Record
            await saveVideo({
                user_id: user.id,
                script_id: scriptId || undefined,
                video_url: publicUrl,
                status: 'ready' // In a real app, maybe processing
            }).unwrap();

            alert('Video uploaded successfully!');
            router.push('/videos');
        } catch (error) {
            console.error(error);
            alert('Failed to upload video');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className={styles.title}>Upload Video</h1>
            <div className={styles.card}>
                <div style={{ border: '2px dashed var(--surface-border)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        style={{ display: 'none' }}
                        id="video-upload"
                    />
                    <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        {file ? (
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{file.name}</div>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)' }}>
                                Click to select video file
                                <br />
                                <span style={{ fontSize: '0.75rem' }}>(MP4, MOV supported)</span>
                            </div>
                        )}
                    </label>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading || isSaving}
                    className={styles.button}
                >
                    {isUploading || isSaving ? 'Uploading...' : 'Upload Video'}
                </button>
            </div>
        </div>
    );
}

export default function UploadVideoPage() {
    return (
        <Suspense fallback={<div>Loading upload form...</div>}>
            <UploadVideoForm />
        </Suspense>
    );
}
