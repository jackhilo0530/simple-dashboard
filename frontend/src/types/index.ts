export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    img_url?: string;
}

export interface ShopProduct {
    id: number;
    name: string;
    description: string;
    category_id: number;
    category: string;
    status: string;
    isDraft: boolean;
    sku: string;
    price: number;
    complete_at_price?: number;
    stock_quantity: number;
    img_url?: string;
    
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    images: string;
}

export interface CartItem {
    id: string;
    productId: number;
    quantity: number;
}

export type Cart = {
    id: string;
    sessionId: string;
    items: CartItem[];
};

export interface OrderItem {
    id: string;
    productId: number;
    quantity: number;
    price: number;
    product: ShopProduct;
}

export interface Order {
    id: number;
    userId: number;
    user: User;
    total_price: number;
    status: string;
    items: OrderItem[];
    createdAt: string;
}