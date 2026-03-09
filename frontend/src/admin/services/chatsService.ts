const VITE_API_ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_BASE_URL || "http://localhost:3000/api/admin";
import type { Chat } from "../../types";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
    };
};

export const chatsApi = {
    async list(): Promise<Chat[]> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/chats`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to fetch chats");
        }

        return data;
    },

    async create(receiver_id: number, message: string, user_id?: number): Promise<void> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/chats`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ receiver_id, message, user_id }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to create chat");
        }
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/chats/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to delete chat");
        }
    },
};