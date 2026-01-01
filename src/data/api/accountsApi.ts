import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Account } from '@/domain/entities/Account';
import { AccountRepositoryImpl } from '@/data/repositories/AccountRepository';

const accountRepo = new AccountRepositoryImpl();

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Accounts'],
    endpoints: (builder) => ({
        getAccounts: builder.query<Account[], string>({
            queryFn: async (userId) => {
                try {
                    const data = await accountRepo.getAccounts(userId);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Accounts'],
        }),
        addAccount: builder.mutation<Account, Partial<Account>>({
            queryFn: async (account) => {
                try {
                    const data = await accountRepo.addAccount(account);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Accounts'],
        }),
        deleteAccount: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    await accountRepo.deleteAccount(id);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Accounts'],
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useAddAccountMutation,
    useDeleteAccountMutation
} = accountsApi;
