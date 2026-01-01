export interface Product {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    affiliate_link?: string;
    original_link?: string;
    image_url?: string;
    commission_rate?: number;
    price?: number;
    is_hot: boolean;
    source?: string;
    created_at: string;
}

export interface IProductRepository {
    getProducts(userId: string): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    createProduct(product: Partial<Product>): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
    findHotProducts(query?: string): Promise<Product[]>; // Mock or API
}
