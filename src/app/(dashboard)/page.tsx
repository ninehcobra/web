'use client';

import styles from '@/ui/ui.module.css';

export default function DashboardPage() {
    return (
        <div>
            <h1 className={styles.title} style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome back, Affiliate!</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {/* Stat Card 1 */}
                <div className={styles.navItem} style={{ background: 'var(--surface)', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Accounts</span>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>0</div>
                </div>

                {/* Stat Card 2 */}
                <div className={styles.navItem} style={{ background: 'var(--surface)', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Products Saved</span>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)' }}>0</div>
                </div>

                {/* Stat Card 3 */}
                <div className={styles.navItem} style={{ background: 'var(--surface)', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Scripts Generated</span>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>0</div>
                </div>

                {/* Stat Card 4 */}
                <div className={styles.navItem} style={{ background: 'var(--surface)', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Videos Uploaded</span>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>0</div>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2 className={styles.title} style={{ marginBottom: '1rem' }}>Recent Activity</h2>
                <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--surface-border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No recent activity found. Start by finding a hot product!
                </div>
            </div>
        </div>
    );
}
