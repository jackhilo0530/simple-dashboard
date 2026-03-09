import { Hono } from "hono";
import {ChatController} from "../../controllers/admin/chatController";

const chat = new Hono();

chat.get("/", ChatController.getChats);
chat.get("/:id", ChatController.getChatById);
chat.post("/", ChatController.createChat);
chat.delete("/:id", ChatController.deleteChat);

export default chat;