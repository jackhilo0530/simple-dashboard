import React from "react";
import { useEffect, useState } from "react";
import { Users, Stone } from 'lucide-react';
import { userApi } from "../services/userService";
import { ordersApi } from "../services/ordersService";


export const EcommerceMetrics: React.FC = () => {

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [accountIsLoggedIn, setAccountIsLoggedIn] = useState(0);
    const [deliveredOrders, setDeliveredOrders] = useState(0);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const usersResponse = await userApi.list();
                const customers = usersResponse.filter((user) => user.role === "USER");
                const accountIsLoggedIn = customers.filter((user) => user.isLoggedIn).length;
                setAccountIsLoggedIn(accountIsLoggedIn);
                setTotalUsers(customers.length);

                const ordersResponse = await ordersApi.list();
                const deliveredOrders = ordersResponse.filter((order) => order.status === "DELIVERED").length;
                setDeliveredOrders(deliveredOrders);
                setTotalOrders(ordersResponse.length);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition">
                <Users className="h-6 w-6 text-gray-500" />
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-lg font-medium text-gray-500">Total Users</span>
                        <p className="mt-2 text-3xl font-semibold text-gray-800">{totalUsers}</p>
                    </div>
                    <span className="text-sm font-medium text-green-500 ring-1 ring-inset ring-green-500 rounded-full px-2 py-0">
                        {Number(accountIsLoggedIn / totalUsers * 100).toFixed(2)}% logged in
                    </span>
                </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition">
                <Stone className="h-6 w-6 text-gray-500" />
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-lg font-medium text-gray-500">Total Orders</span>
                        <p className="mt-2 text-3xl font-semibold text-gray-800">{totalOrders}</p>
                    </div>
                    <span className="text-sm font-medium text-green-500 ring-1 ring-inset ring-green-500 rounded-full px-2 py-0">
                        {Number(deliveredOrders / totalOrders * 100).toFixed(2)}% delivered
                    </span>
                </div>
            </div>
        </div>
    );
};