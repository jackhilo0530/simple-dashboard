import type { User } from "../../types";

const VITE_API_ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_BASE_URL || "http://localhost:3000/api/admin";

export const userApi = {
    async list(): Promise<User[]> {
        const token = localStorage.getItem("token");
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/users`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        const body = await res.json().catch(() => ({}));


        if (!res.ok) {
            throw new Error(body.message || "failed to fetch users");
        }

        return body;
    },

    async delete(userId: number): Promise<void> {
        const token = localStorage.getItem("token");
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(body.message || "failed to delete user");
        }
    },
};
