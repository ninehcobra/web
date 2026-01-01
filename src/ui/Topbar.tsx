'use client';

import { useAppSelector } from '@/presentation/hooks/reduxHooks';
import { supabase } from '@/data/supabaseClient';
import styles from './ui.module.css';
import { useRouter } from 'next/navigation';

export default function Topbar() {
    const { user } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.title}>
                Overview
            </div>
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <span className={styles.email}>{user?.email}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Sign Out
                </button>
            </div>
        </header>
    );
}
