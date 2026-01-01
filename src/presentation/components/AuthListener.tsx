'use client';

import { useEffect } from 'react';
import { supabase } from '@/data/supabaseClient';
import { useAppDispatch } from '@/presentation/hooks/reduxHooks';
import { setUser, setLoading } from '@/presentation/slices/authSlice';

export default function AuthListener() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            dispatch(setUser(session?.user ?? null));
            dispatch(setLoading(false));

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                (_event, session) => {
                    dispatch(setUser(session?.user ?? null));
                    dispatch(setLoading(false));
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        };

        initializeAuth();
    }, [dispatch]);

    return null;
}
