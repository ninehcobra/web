import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import { productsApi } from '@/data/api/productsApi';
import { scriptsApi } from '@/data/api/scriptsApi';
import { videosApi } from '@/data/api/videosApi';
import { accountsApi } from '@/data/api/accountsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [scriptsApi.reducerPath]: scriptsApi.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productsApi.middleware,
      scriptsApi.middleware,
      videosApi.middleware,
      accountsApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
