import { Context } from "hono";
import {OrderService} from "../../services/orderService";
import { OrderStatus } from "../../generated/prisma/enums";

export const OrderController = {
    // createOrder: async (c: Context) => {
    //     try {
    //         const body = await c.req.parseBody();
    //         const order = await OrderService.createOrder(body);
    //         return c.json(order, 201);
    //     } catch (err: any) {
    //         if (err.type === "validation") {
    //             return c.json({
    //                 message: "validation error",
    //                 errors: err.errors,
    //             }, 400);
    //         }
    //         return c.json({ message: "internal server error" }, 500);
    //     }
    // },
    getOrders: async (c: Context) => {
        try {
            const orders = await OrderService.getOrders();
            return c.json(orders);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    // getOrderById: async (c: Context) => {
    //     try {
    //         const id = Number(c.req.param("id"));
    //         if (Number.isNaN(id) || id <= 0) {
    //             return c.json({ message: "invalid order id" }, 400);
    //         }
    //         const order = await OrderService.getOrderById(id);
    //         if (!order) {
    //             return c.json({ message: "order not found" }, 404);
    //         }
    //         return c.json(order);
    //     } catch (error) {
    //         return c.json({ message: "internal server error" }, 500);
    //     }
    // },
    // updateOrder: async (c: Context) => {
    //     try {
    //         const id = Number(c.req.param("id"));
    //         if (Number.isNaN(id) || id <= 0) {
    //             return c.json({ message: "invalid order id" }, 400);
    //         }
    //         const body = await c.req.parseBody();
    //         const order = await OrderService.updateOrder(id, body);
    //         if (!order) {
    //             return c.json({ message: "order not found" }, 404);
    //         }
    //         return c.json(order);
    //     } catch (err: any) {
    //         if (err.type === "validation") {
    //             return c.json({
    //                 message: "validation error",
    //                 errors: err.errors,
    //             }, 400);
    //         }
    //         return c.json({ message: "internal server error" }, 500);
    //     }
    // },
    deleteOrder: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid order id" }, 400);
            }
            await OrderService.deleteOrder(id);
            return c.json({ message: "order deleted successfully" });
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    updateOrderStatus: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid order id" }, 400);
            }
            const body = await c.req.json();
            console.log("Received body:", {id, status: body.status});
            const order = await OrderService.updateOrderStatus(id, OrderStatus[body.status as keyof typeof OrderStatus]);
            if (!order) {
                return c.json({ message: "order not found" }, 404);
            }
            return c.json(order);
        } catch (err: any) {
            if (err.type === "validation") {
                return c.json({
                    message: "validation error",
                    errors: err.errors,
                }, 400);
            }
            return c.json({ message: "internal server error" }, 500);
        }
    },
};