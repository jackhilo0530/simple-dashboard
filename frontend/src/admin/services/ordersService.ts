const VITE_API_ADMIN_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/admin";
import type { Order } from "../../types";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
    };
};

export const ordersApi = {
    async list(): Promise<Order[]> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/orders`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to fetch orders");
        }

        return data;
    },
    async delete(id: number): Promise<void> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/orders/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to delete order");
        }
    },
    async updateStatus(id: number, status: string): Promise<void> {
        console.log("Updating order status:", { id, status });
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/orders/${id}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to update order status");
        }
    },
};