'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react';
import AuthListener from './components/AuthListener';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthListener />
            {children}
        </Provider>
    );
}
