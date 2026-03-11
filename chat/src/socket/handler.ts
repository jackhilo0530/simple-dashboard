import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma.js";

export const setupSocketHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {

        socket.on("joinRoom", (userId: number) => {
            // Force join their own ID-based room
            socket.join(`user_${userId}`);
        });

        socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
            if (!message.trim()) return;

            try {
                const chat = await prisma.chat.create({
                    data: {
                        user_id: Number(senderId),
                        receiver_id: Number(receiverId),
                        message,
                    },
                });

                // Emit to both target rooms at once
                io.to([`user_${receiverId}`, `user_${senderId}`]).emit("receiveMessage", chat);
            } catch (error) {
                console.error("Prisma Error:", error);
                socket.emit("error", { message: "Message delivery failed" });
            }
        });
    });
};