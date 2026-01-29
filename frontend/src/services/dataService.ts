const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import type { Product } from "../types";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
    };
};

export const productApi = {
    async list(page: number, limit: number): Promise<{products: Product[], total: number}> {
        const res = await fetch(`${API_BASE}/api/products?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders(),
        });
        console.log(res);

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to fetch products");
        }
        console.log(data);
        return data;
    },

    async getProduct(id: number): Promise<Product> {
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
            headers: getAuthHeaders(),
        });

        const product = await res.json();

        if (!res.ok) {
            throw new Error(product.message || "failed to fetch products");
        }
        return product;
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || "failed to delete");
        }
    }

};