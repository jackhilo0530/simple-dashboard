import { Context } from "hono";
import {OrderService} from "../../services/orderService";
import { ShipmentService } from "../../services/shipmentService";
import { OrderStatus } from "@repo/db/generated-client/enums";

export const OrderController = {
    
    getOrders: async (c: Context) => {
        try {
            const orders = await OrderService.getOrders();
            return c.json(orders);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },

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
            if(body.status === OrderStatus.SHIPPED) {
                await ShipmentService.createShipmentForOrder(id);
            }
            if(body.status === OrderStatus.CANCELLED) {
                await ShipmentService.deleteShipment(id);
            }
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