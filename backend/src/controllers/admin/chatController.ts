import { Context } from "hono";
import { ChatService } from "../../services/chatService";
import { create } from "node:domain";
import user from "../../routes/admin/user";

export const ChatController = {
    getChats: async (c: Context) => {
        try {
            const chats = await ChatService.getChats();
            return c.json(chats);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    getChatById: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const chat = await ChatService.getChatById(id);
            if (!chat) {
                return c.json({ message: "chat not found" }, 404);
            }
            return c.json(chat);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    createChat: async (c: Context) => {
        try {
            const body = await c.req.json();
            const chat = await ChatService.createChat(body);
            return c.json(chat, 201);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    deleteChat: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            await ChatService.deleteChat(id);
            return c.json({ message: "chat deleted" });
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
};