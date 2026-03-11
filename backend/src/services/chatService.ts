import { prisma } from "../lib/prisma";

export const ChatService = {
    getChats: async () => {
        return await prisma.chat.findMany({
            include: {
                sender: true,
            },
        });
    },
    getChatById: async (id: number) => {
        return await prisma.chat.findUnique({
            where: { id },
            include: {
                sender: true,
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
                sender: true,
            },
        });
    },
    deleteChat: async (id: number) => {
        const chat = await prisma.chat.findUnique({
            where: { id },
            include: {
                sender: true,
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