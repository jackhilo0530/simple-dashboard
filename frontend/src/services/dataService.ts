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
    async list(): Promise<Product[]> {
        const res = await fetch(`${API_BASE}/api/products`, {
            headers: getAuthHeaders(),
        });
        console.log(res);

        const {products} = await res.json();


        if (!res.ok) {
            throw new Error(products.message || "failed to fetch products");
        }
        console.log(products);
        return products;
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