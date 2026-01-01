'use client';

import { Product } from '@/domain/entities/Product';
import styles from './ui.module.css';

interface ProductCardProps {
    product: Product;
    onGenerateScript?: (product: Product) => void;
    onDelete?: (id: string) => void;
    isHotResult?: boolean;
    onSave?: (product: Product) => void;
}

export default function ProductCard({
    product,
    onGenerateScript,
    onDelete,
    isHotResult = false,
    onSave
}: ProductCardProps) {
    return (
        <div className={styles.card} style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image_url || 'https://placehold.co/400x300/1e1e24/FFF?text=No+Image'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.is_hot && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'var(--secondary-gradient)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        HOT 🔥
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {product.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                        ${product.price}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                        Comm: {product.commission_rate}%
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isHotResult && onSave ? (
                        <button
                            onClick={() => onSave(product)}
                            className={styles.button}
                            style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                        >
                            Save Product
                        </button>
                    ) : (
                        <>
                            {onGenerateScript && (
                                <button
                                    onClick={() => onGenerateScript(product)}
                                    className={styles.button}
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
                                >
                                    Create Script
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(product.id)}
                                    style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    🗑️
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
