'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons';
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
                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }} />
                    <span className={styles.email}>{user?.email}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
            </div>
        </header>
    );
}
