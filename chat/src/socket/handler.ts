import { Server, Socket } from "socket.io";
import db from "@repo/db";

const { prisma } = db;

export const setupSocketHandlers = (io: Server) => {
    const server: any = io;
    server.on("connection", (socket: Socket) => {
        
        socket.on("joinRoom", (userId: number) => {
            // Force join their own ID-based room
            socket.join(`user_${userId}`);
        });

        socket.on("sendMessage", async ({ senderId, receiverId, message } : { senderId: number, receiverId: number, message: string }) => {
            if (!message.trim()) return;

            try {
                const chat = await prisma.chat.create({
                    data: {
                        user_id: Number(senderId),
                        receiver_id: Number(receiverId),
                        message,
                    },
                    include: {
                        sender: true,
                    },
                });

                // Emit to both target rooms at once
                io.to(`user_${receiverId}`).emit("receiveMessage", chat);
            } catch (error) {
                console.error("Prisma Error:", error);
                socket.emit("error", { message: "Message delivery failed" });
            }
        });
    });
};