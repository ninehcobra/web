'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartSimple,
    faUsers,
    faBoxOpen,
    faFileLines,
    faVideo,
    faGear,
    faBolt
} from '@fortawesome/free-solid-svg-icons';
import styles from './ui.module.css';

const navItems = [
    { name: 'Dashboard', href: '/', icon: faChartSimple },
    { name: 'Accounts', href: '/accounts', icon: faUsers },
    { name: 'Products', href: '/products', icon: faBoxOpen },
    { name: 'Scripts', href: '/scripts', icon: faFileLines },
    { name: 'Videos', href: '/videos', icon: faVideo },
    { name: 'Settings', href: '/settings', icon: faGear },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <FontAwesomeIcon icon={faBolt} style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />
                <span>Auto</span>Affiliate
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>
                            <FontAwesomeIcon icon={item.icon} width={20} />
                        </span>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
