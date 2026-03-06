const VITE_API_ADMIN_BASE_URL = import.meta.env.VITE_API_ADMIN_BASE_URL || "http://localhost:3000/api/admin";
import type { Shipment } from "../../types";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
    };
};

export const shipmentsApi = {
    async list(): Promise<Shipment[]> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/shipments`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to fetch shipments");
        }

        return data;
    },

    async updateCarrier(shipmentId: number, carrier: string): Promise<void> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/shipments/${shipmentId}/carrier`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ carrier }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to update carrier");
        }
    },
    
    async updateStatus(shipmentId: number, status: string): Promise<void> {
        const res = await fetch(`${VITE_API_ADMIN_BASE_URL}/shipments/${shipmentId}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed to update status");
        }
    },
};