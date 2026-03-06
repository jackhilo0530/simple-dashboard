// const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React from "react";
import { useEffect, useState } from "react";
import type { Shipment } from "../../types";
import { shipmentsApi } from "../services/shipmentsService";

const Shipments: React.FC = () => {

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [carrier, setCarrier] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                setError("");
                const data = await shipmentsApi.list();
                setShipments(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch shipments");
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, [carrier, status]);

    if (loading) {
        return <div className="flex-1 p-10 min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex-1 p-10 min-h-screen text-red-500">Error: {error}</div>;
    }

    const onCarrierClick = async (shipmentId: number, carrier: string) => {
        const nextCarrier = {
            "UPS": "FedEx",
            "FedEx": "DHL",
            "DHL": "USPS",
            "USPS": "UPS"
        }[carrier] || "UPS";

        try {
            await shipmentsApi.updateCarrier(shipmentId, nextCarrier);
            setCarrier(nextCarrier);
            setShipments(shipments.map(s => s.id === shipmentId ? { ...s, carrier: nextCarrier } : s));
        } catch (err: any) {
            alert(err.message || "Failed to update carrier");
        }
    };

    const onStatusClick = async (shipmentId: number, status: string) => {
        const nextStatus = {
            "PENDING": "SHIPPED",
            "SHIPPED": "DELIVERED",
            "DELIVERED": "DELIVERED",
            "RETURNED": "RETURNED"
        }[status] || "PENDING";

        try {
            await shipmentsApi.updateStatus(shipmentId, nextStatus);
            setStatus(nextStatus);
            setShipments(shipments.map(s => s.id === shipmentId ? { ...s, status: nextStatus } : s));
        } catch (err: any) {
            alert(err.message || "Failed to update status");
        }
    };


    return (
        <div className="flex-1 p-10 min-h-screen bg-white">
            <h1 className="text-2xl font-bold mb-4">Shipments</h1>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
                {shipments.length === 0 ? (
                    <p className="p-4 text-gray-500">No shipments found.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 h-12">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Shipment ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Track Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Carrier</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created At</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Shipped At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments.map((shipment) => (
                                <tr key={shipment.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.tracking_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button onClick={() => { onCarrierClick(shipment.id, shipment.carrier) }} disabled={shipment.status !== "PENDING"} className="py-0 px-2 inline-flex text-xs font-semibold rounded-full border border-green-500 bg-green-100 text-green-800">
                                            {shipment.carrier}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        <span onClick={() => { onStatusClick(shipment.id, shipment.status) }} className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shipment.status === "PENDING" ? "border border-yellow-500 bg-yellow-100 text-yellow-800" : "border border-green-500 bg-green-100 text-green-800"}`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex flex-col gap-1">
                                        {new Date(shipment.createdAt).toDateString()}
                                        <span className="text-xs text-gray-500">{new Date(shipment.createdAt).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {shipment.shipped_at ? new Date(shipment.shipped_at).toDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Shipments;