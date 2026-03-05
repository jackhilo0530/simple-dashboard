import { create } from "node:domain";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../generated/prisma/enums";

export const OrderService = {
    getOrders: async () => {
        const orders = await prisma.order.findMany();
        const userIds = orders.map((o) => o.user_id);
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order_id: {
                    in: orders.map((o) => o.id),
                },
            },
        });
        const productIds = orderItems.map((item) => item.product_id);
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        return orders.map((order) => ({
            ...order,
            user: userMap.get(order.user_id) || null,
            items: orderItems
                .filter((item) => item.order_id === order.id)
                .map((item) => ({
                    ...item,
                    product: productMap.get(item.product_id) || null,
                })),
        }));

    },

    deleteOrder: async (id: number) => {
        const order = await prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            return null;
        }
        await prisma.orderItem.deleteMany({
            where: { order_id: id },
        });
        await prisma.order.delete({
            where: { id },
        });
        return order;
    },

    updateOrderStatus: async (id: number, status: OrderStatus) => {
        console.log("Updating order status:", { id, status });
        const order = await prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            return null;
        }
        const updated = await prisma.order.update({
            where: { id },
            data: { status },
        });
        return updated;
    },
}
