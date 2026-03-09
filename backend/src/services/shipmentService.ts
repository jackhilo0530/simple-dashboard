import {prisma} from "../lib/prisma";
import { ShipmentCarrier, ShipmentStatus } from "../generated/prisma/enums";

export const ShipmentService = {
    createShipmentForOrder: async (orderId: number) => {

        const existingShipment = await prisma.shipment.findFirst({
            where: {
                order_id: orderId,
            },
        });
        if (existingShipment) {
            return existingShipment;
        }

        return await prisma.shipment.create({
            data: {
                order_id: orderId,
                tracking_number: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                shipped_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 days later
            },
            include: {
                order: true,
            },
        });
    },
    getShipments: async () => {
        return await prisma.shipment.findMany({
            include: {
                order: true,
            },
        });
    },
    getShipmentById: async (id: number) => {
        return await prisma.shipment.findUnique({
            where: { id },
            include: {
                order: true,
            },
        });
    },

    deleteShipment: async (id: number) => {
        const shipment = await prisma.shipment.findUnique({
            where: { order_id: id },
        });
        if (!shipment) {
            return null;
        }
        await prisma.shipment.delete({
            where: { order_id: id },
        });
        return shipment;
    },
    updateShipmentCarrier: async (id: number, carrier: ShipmentCarrier) => {
        const shipment = await prisma.shipment.findUnique({
            where: { id },
        });
        if (!shipment) {
            return null;
        }
        return await prisma.shipment.update({
            where: { id },
            data: {
                carrier,
                updatedAt: new Date(),
            },
        });
    },
    updateShipmentStatus: async (id: number, status: ShipmentStatus) => {
        const shipment = await prisma.shipment.findUnique({
            where: { id },
        });
        if (!shipment) {
            return null;
        }
        return await prisma.shipment.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date(),
            },
        });
    },
};