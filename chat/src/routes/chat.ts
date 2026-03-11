import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";

const chatRoutes = new Hono();

// GET /api/messages/:userId/:contactId
chatRoutes.get("/:userId/:contactId", async (c) => {
    const userId = parseInt(c.req.param("userId"));
    const contactId = parseInt(c.req.param("contactId"));
    

    try {
        const messages = await prisma.chat.findMany({
            where: {
                OR: [
                    { user_id: userId, receiver_id: contactId },
                    { user_id: contactId, receiver_id: userId }

                ],
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        return c.json(messages);
    } catch (error) {
        return c.json({ error: "Failed to fetch messages" }, 500);
    }
});

export default chatRoutes;