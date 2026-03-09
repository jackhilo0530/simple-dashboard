import { prisma } from "../lib/prisma";

export const ChatService = {
    getChats: async () => {
        return await prisma.chat.findMany({
            include: {
                user: true,
            },
        });
    },
    getChatById: async (id: number) => {
        return await prisma.chat.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    },
    createChat: async (data: { user_id: number; message: string; receiver_id: number }) => {
        if(await prisma.chat.count() >= 1000) {
            await prisma.chat.delete({
                where: {
                    id: (await prisma.chat.findFirst({
                        orderBy: { createdAt: "asc" },
                    }))?.id,
                },
            });
        }
        return await prisma.chat.create({
            data: {
                user_id: data.user_id,
                message: data.message,
                receiver_id: data.receiver_id,
            },
            include: {
                user: true,
            },
        });
    },
    deleteChat: async (id: number) => {
        const chat = await prisma.chat.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        if (!chat) {
            return null;
        }
        await prisma.chat.delete({
            where: { id },
        });
        return chat;
    },
};