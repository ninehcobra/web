'use client';

import { useState } from 'react';
import { supabase } from '@/data/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // For simplicity, we'll try sign up first, then sign in if user exists
        // Ideally this should be separate, but for a quick start tool:
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            if (signInError.message.includes('Invalid login credentials')) {
                // Maybe they want to sign up?
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) {
                    setError(signInError.message);
                } else {
                    setError('Account created! Please check your email or sign in (if auto-confirm is on).');
                    // In dev environment, usually auto-confirm is off or requires email check
                }
            } else {
                setError(signInError.message);
            }
        } else {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Auto Affiliate</h1>
                <p className={styles.subtitle}>Sign in to continue</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Processing...' : 'Sign In / Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}
