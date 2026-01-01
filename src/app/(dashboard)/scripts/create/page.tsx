'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetProductsQuery } from '@/data/api/productsApi';
import { useGenerateScriptMutation, useSaveScriptMutation } from '@/data/api/scriptsApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import styles from '@/ui/ui.module.css';

function CreateScriptForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const { user } = useAppSelector((state) => state.auth);

    const { data: products } = useGetProductsQuery(user?.id ?? '', { skip: !user });
    const [generateScript, { isLoading: isGenerating }] = useGenerateScriptMutation();
    const [saveScript, { isLoading: isSaving }] = useSaveScriptMutation();

    const [selectedProductId, setSelectedProductId] = useState(productId || '');
    const [style, setStyle] = useState('engaging');
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);

    useEffect(() => {
        if (productId) setSelectedProductId(productId);
    }, [productId]);

    const handleGenerate = async () => {
        const product = products?.find(p => p.id === selectedProductId);
        if (!product) return alert('Please select a product');

        try {
            const result = await generateScript({
                productName: product.name,
                description: product.description || '',
                style
            }).unwrap();

            setGeneratedContent(result);
        } catch (error) {
            console.error(error);
            alert('Failed to generate script');
        }
    };

    const handleSave = async () => {
        if (!generatedContent || !user) return;
        const product = products?.find(p => p.id === selectedProductId);

        try {
            // Parse content to get title if possible
            let title = `Script for ${product?.name}`;
            try {
                const json = JSON.parse(generatedContent);
                if (json.title) title = json.title;
            } catch (e) {
                // Content might not be JSON if generation failed format
            }

            await saveScript({
                user_id: user.id,
                product_id: selectedProductId,
                title: title,
                content: generatedContent,
                style: style,
            }).unwrap();

            router.push('/scripts');
        } catch (error) {
            console.error(error);
            alert('Failed to save script');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Create New Script</h1>

            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                    <label>Select Product</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className={styles.input}
                        style={{ background: 'var(--surface-hover)' }}
                    >
                        <option value="">-- Choose a Product --</option>
                        {products?.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                    <label>Script Style</label>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className={styles.input}
                        style={{ background: 'var(--surface-hover)' }}
                    >
                        <option value="engaging">Engaging / Viral</option>
                        <option value="storytelling">Storytelling</option>
                        <option value="hard-sell">Hard Sell</option>
                        <option value="educational">Educational</option>
                        <option value="humorous">Humorous</option>
                    </select>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedProductId}
                    className={styles.button}
                >
                    {isGenerating ? 'Generating with AI...' : '✨ Generate Script'}
                </button>
            </div>

            {generatedContent && (
                <div className={styles.card}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Generated Script</h3>
                    <div style={{
                        background: 'var(--surface-hover)',
                        padding: '1rem',
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '1.5rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-secondary)',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {generatedContent}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setGeneratedContent(null)} style={{ padding: '0.75rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                            Discard
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className={styles.button} style={{ flex: 1, background: '#10b981' }}>
                            {isSaving ? 'Saving...' : 'Save Script'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreateScriptPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <CreateScriptForm />
        </Suspense>
    );
}
