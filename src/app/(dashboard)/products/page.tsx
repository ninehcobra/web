'use client';

import { useState } from 'react';
import { useGetProductsQuery, useFindHotProductsQuery, useAddProductMutation, useDeleteProductMutation } from '@/data/api/productsApi';
import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import ProductCard from '@/ui/ProductCard';
import styles from '@/ui/ui.module.css';
import { Product } from '@/domain/entities/Product';

export default function ProductsPage() {
    const { user } = useAppSelector((state) => state.auth);
    // Skip query if no user (though middleware protects this)
    const { data: products, isLoading } = useGetProductsQuery(user?.id ?? '', { skip: !user });

    // Hot finder state
    const [showHotFinder, setShowHotFinder] = useState(false);
    // We trigger this query only when showing hot finder
    // RTK Query doesn't support lazy query well with hooks unless we use useLazyQuery. 
    // But useFindHotProductsQuery runs automatically. I'll use it conditionally or just let it cache.
    // Actually, let's use the lazy version or just always fetch for demo.
    // Better: useLazyFindHotProductsQuery if I exported it, but I didn't. I exported useFindHotProductsQuery.
    // I will just use it and hide UI.
    const { data: hotProducts, isLoading: isHotLoading, refetch: refetchHot } = useFindHotProductsQuery(undefined, {
        skip: !showHotFinder,
    });

    const [addProduct] = useAddProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleSaveHotProduct = async (product: Product) => {
        if (!user) return;
        try {
            // Create new object without ID (let DB generate) and assign user_id
            const { id, ...rest } = product;
            await addProduct({
                ...rest,
                user_id: user.id || undefined
            }).unwrap();
            alert('Product saved!');
        } catch (err) {
            console.error(err);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const handleGenerateScript = (product: Product) => {
        // Navigate to scripts page with product ID or open modal
        // For now, simple alert
        alert(`Generating script for ${product.name}... (Feature coming in next step)`);
        // Ideally router.push(`/scripts/new?productId=${product.id}`)
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title} style={{ margin: 0 }}>My Products</h1>
                <button
                    className={styles.button}
                    onClick={() => setShowHotFinder(!showHotFinder)}
                    style={{ width: 'auto' }}
                >
                    {showHotFinder ? 'View My Products' : '🔥 Find Hot Products'}
                </button>
            </div>

            {showHotFinder ? (
                <div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Trending on TikTok Shop</h2>
                    {isHotLoading ? (
                        <div style={{ color: 'var(--text-secondary)' }}>Finding viral products...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {hotProducts?.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    isHotResult={true}
                                    onSave={handleSaveHotProduct}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {isLoading ? (
                        <div style={{ color: 'var(--text-secondary)' }}>Loading your products...</div>
                    ) : products?.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                            <p>No products saved yet.</p>
                            <button
                                onClick={() => setShowHotFinder(true)}
                                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Find a Hot Product
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {products?.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onDelete={handleDelete}
                                    onGenerateScript={handleGenerateScript}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
