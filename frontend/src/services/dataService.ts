const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
import type { Product, ShopProduct } from "../types";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
    };
};

export const productApi = {
    async list(page: number, limit: number, search: string, sortBy: string, order: string, filter: string): Promise<{products: Product[], total: number}> {
        
        const res =  await fetch(`${API_BASE}/products?sortBy=${sortBy}&order=${order}&search=${search}&page=${page}&limit=${limit}&filter=${filter}`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to fetch products");
        }
        console.log(data);
        return data;
    },

    async getProduct(id: number): Promise<Product> {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            headers: getAuthHeaders(),
        });

        const product = await res.json();

        if (!res.ok) {
            throw new Error(product.message || "failed to fetch products");
        }
        return product;
    },

    async category(): Promise<[]> {
        const res = await fetch(`${API_BASE}/products/category`, {
            headers: getAuthHeaders(),
        });

        const list = await res.json();

        if(!res.ok) {
            throw new Error(list.message || "failed to fetch category-list");
        }

        return list;
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || "failed to delete");
        }
    },

    async getProducts(): Promise<ShopProduct[]> {
        const res = await fetch(`${API_BASE}/shopProducts`, {
            headers: getAuthHeaders(),
        });

        const products = await res.json();
        if (!res.ok) {
            throw new Error(products.message || "failed to fetch shop products");
        }
        return products;
    },

    async getProductById(id: number): Promise<ShopProduct> {
        const res = await fetch(`${API_BASE}/shopProducts/${id}`, {
            headers: getAuthHeaders(),
        });

        const product = await res.json();
        if (!res.ok) {
            throw new Error(product.message || "failed to fetch shop product");
        }
        return product;
    },

    async deleteShopProduct(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/shopProducts/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || "failed to delete");
        }
    },
};