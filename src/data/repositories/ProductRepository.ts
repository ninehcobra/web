import { supabase } from '@/data/supabaseClient';
import { IProductRepository, Product } from '@/domain/entities/Product';

export class ProductRepositoryImpl implements IProductRepository {
    async getProducts(userId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data as Product[];
    }

    async getProductById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data as Product;
    }

    async createProduct(product: Partial<Product>): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Product;
    }

    async deleteProduct(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async findHotProducts(query: string = ''): Promise<Product[]> {
        // Mock implementation for "Hot Products" finder
        // In a real app, this would scrape TikTok or use an API
        return [
            {
                id: 'mock-1',
                user_id: 'system', // specialized handling needed for system vs user
                name: 'Viral Sunset Lamp',
                description: 'Create the perfect golden hour vibe in your room. Multi-color projection.',
                price: 15.99,
                commission_rate: 20,
                is_hot: true,
                source: 'tiktok_shop',
                image_url: 'https://placehold.co/400x400/purple/white?text=Sunset+Lamp',
                created_at: new Date().toISOString()
            },
            {
                id: 'mock-2',
                user_id: 'system',
                name: 'Smart Neck Massager',
                description: 'Relieve neck pain instantly with TENS pulse technology.',
                price: 29.99,
                commission_rate: 25,
                is_hot: true,
                source: 'tiktok_shop',
                image_url: 'https://placehold.co/400x400/blue/white?text=Neck+Massager',
                created_at: new Date().toISOString()
            },
            {
                id: 'mock-3',
                user_id: 'system',
                name: 'Galaxy Star Projector',
                description: 'Transform your ceiling into a starry night sky.',
                price: 35.00,
                commission_rate: 30,
                is_hot: true,
                source: 'tiktok_shop',
                image_url: 'https://placehold.co/400x400/black/white?text=Star+Projector',
                created_at: new Date().toISOString()
            }
        ];
    }
}
