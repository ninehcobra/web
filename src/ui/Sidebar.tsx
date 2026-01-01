'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ui.module.css';

const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Accounts', href: '/accounts', icon: '📱' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Scripts', href: '/scripts', icon: '📝' },
    { name: 'Videos', href: '/videos', icon: '🎬' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>Auto</span>Affiliate
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
