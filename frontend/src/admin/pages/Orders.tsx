const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React from "react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Order } from "../../types";
import { ordersApi } from "../services/ordersService";

const Orders: React.FC = () => {

    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError("");
                const data = await ordersApi.list();
                setOrders(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [status]);

    if (loading) {
        return <div className="flex-1 p-10 min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex-1 p-10 min-h-screen text-red-500">Error: {error}</div>;
    }

    const onDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return;
        }
        try {
            await ordersApi.delete(id);
            setOrders(orders.filter((order) => order.id !== id));
        } catch (err: any) {
            alert(err.message || "Failed to delete order");
        }
    };

    const updateStatus = async (id: number, currentStatus: string) => {
        const nextStatus = {
            PENDING: "SHIPPED",
            SHIPPED: "CANCELLED",
            DELIVERED: "DELIVERED",
            CANCELLED: "PENDING",
        }[currentStatus] || "PENDING";

        try {
            await ordersApi.updateStatus(id, nextStatus);
            setStatus(nextStatus);
            setOrders(orders.map((order) => order.id === id ? { ...order, status: nextStatus } : order));
        } catch (err: any) {
            alert(err.message || "Failed to update order status");
        }
    };

    return (
        <div className="flex-1 p-10 min-h-screen bg-white">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
                <table className="w-full rounded-xl ring-1 ring-gray-200 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" style={{ width: "10%" }} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                            <th scope="col" style={{ width: "25%" }} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                            <th scope="col" style={{ width: "20%" }} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                            <th scope="col" style={{ width: "10%" }} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                            <th scope="col" style={{ width: "5%" }} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                            <th scope="col" style={{ width: "5%" }} className="relative px-6 py-4">
                                <span className="sr-only">Toggle</span>
                            </th>
                            <th scope="col" style={{ width: "5%" }} className="py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <span className="sr-only">Action</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr className="hover:bg-gray-50">
                                    <td className=" py-4 pl-10 text-sm text-gray-600">#{order.id}</td>
                                    <td className="flex items-center gap-3  px-6 py-4 text-sm">
                                        <img src={`${API_BASE_URL}${order.user.img_url}`} alt="img" className="w-10 h-10 rounded-full" />
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.user.username}
                                            <div className="text-xs text-gray-500">{order.user.email}</div>
                                        </div>
                                    </td>
                                    <td className=" px-6 py-4 text-sm text-gray-900">
                                        {new Date(order.createdAt).toDateString()}
                                        {order.createdAt ? <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div> : ''}
                                    </td>
                                    <td className=" px-6 py-4 text-sm text-gray-900 font-semibold">${Number(order.total_price).toFixed(2)}</td>
                                    <td className=" px-6 py-4">
                                        <button onClick={() => updateStatus(order.id, order.status)} className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset
                                            ${{
                                                PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
                                                SHIPPED: "bg-blue-50 text-blue-700 ring-blue-600/20",
                                                DELIVERED: "bg-green-50 text-green-700 ring-green-600/20",
                                                CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
                                            }[order.status] || "bg-gray-50 text-gray-600 ring-gray-600/20"}
                                            `}>
                                            {order.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <ChevronDown
                                            onClick={() => setExpandedRows((prev) => prev.includes(order.id) ? prev.filter((id) => id !== order.id) : [...prev, order.id])}
                                            className={`h-5 w-5 text-gray-400 cursor-pointer transition-transform ${expandedRows.includes(order.id) ? 'rotate-180' : ''}`}
                                        />
                                    </td>
                                    <td className="py-4 text-sm font-medium">
                                        <button onClick={() => onDelete(order.id)} className="cursor-pointer bg-white rounded-md border border-red-600 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                                {expandedRows.includes(order.id) && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={7} className="px-6 py-4"> {/* 3. Fixed colSpan to 7 */}
                                            <div className="text-sm text-gray-700 rounded-lg border border-gray-100 bg-white p-4">
                                                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Order Items</h3>
                                                <div className="mt-2 space-y-3">
                                                    {order.items.map((item) => ( // Note: Check if field is 'orderItems' or 'items'
                                                        <div key={item.id} className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                                            <div className="flex items-center gap-4">
                                                                <img src={`${API_BASE_URL}${item.product.img_url}`} alt="" className="h-16 w-16 rounded-md object-cover ring-1 ring-gray-200" />
                                                                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                                            </div>
                                                            <div className="flex itemx-center gap-10">
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                                <p className="text-sm font-semibold text-gray-900">${Number(item.price).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Orders;