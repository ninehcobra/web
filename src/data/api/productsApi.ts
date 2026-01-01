import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@/domain/entities/Product';
import { ProductRepositoryImpl } from '@/data/repositories/ProductRepository';

const productRepo = new ProductRepositoryImpl();

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], string>({
            queryFn: async (userId) => {
                try {
                    const data = await productRepo.getProducts(userId);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Products'],
        }),
        findHotProducts: builder.query<Product[], void>({
            queryFn: async () => {
                try {
                    const data = await productRepo.findHotProducts();
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
        }),
        addProduct: builder.mutation<Product, Partial<Product>>({
            queryFn: async (newProduct) => {
                try {
                    const data = await productRepo.createProduct(newProduct);
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    await productRepo.deleteProduct(id);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Products'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useFindHotProductsQuery,
    useAddProductMutation,
    useDeleteProductMutation
} = productsApi;
