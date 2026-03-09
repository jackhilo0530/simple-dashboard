import { Context } from "hono";
import { ShipmentService } from "../../services/shipmentService";
import { OrderService } from "../../services/orderService";
import { ShipmentCarrier, ShipmentStatus, OrderStatus } from "../../generated/prisma/enums";

export const ShipmentController = {
    getShipments: async (c: Context) => {
        try {
            const shipments = await ShipmentService.getShipments();
            return c.json(shipments);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    getShipmentById: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const shipment = await ShipmentService.getShipmentById(id);
            if (!shipment) {
                return c.json({ message: "shipment not found" }, 404);
            }
            return c.json(shipment);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    updateShipmentCarrier: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const body = await c.req.json();
            const shipment = await ShipmentService.getShipmentById(id);
            if (!shipment) {
                return c.json({ message: "shipment not found" }, 404);
            }
            await ShipmentService.updateShipmentCarrier(id, ShipmentCarrier[body.carrier as ShipmentCarrier]);
            return c.json({ message: "carrier updated" });
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },

    updateShipmentStatus: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const body = await c.req.json();
            const shipment = await ShipmentService.getShipmentById(id);
            if (!shipment) {
                return c.json({ message: "shipment not found" }, 404);
            }
            if(body.status === ShipmentStatus.DELIVERED) {
                await OrderService.updateOrderStatus(shipment.order_id, OrderStatus.DELIVERED);
            }
            await ShipmentService.updateShipmentStatus(id, ShipmentStatus[body.status as ShipmentStatus]);
            return c.json({ message: "status updated" });
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
};