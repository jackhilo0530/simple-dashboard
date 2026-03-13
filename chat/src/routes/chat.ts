import { Hono } from "hono";
import db from "@repo/db";

const {prisma} = db

const chatRoutes = new Hono();

// GET /api/messages/:userId/:contactId
chatRoutes.get("/:userId/:contactId", async (c) => {
    const userId = parseInt(c.req.param("userId"));
    const contactId = parseInt(c.req.param("contactId"));
    const page = Number(c.req.query("page")) || 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    console.log("Received request for messages with:", { userId, contactId, page });

    try {
        const messages = await prisma.chat.findMany({
            where: {
                OR: [
                    { user_id: userId, receiver_id: contactId },
                    { user_id: contactId, receiver_id: userId }

                ],
            },
            orderBy: { createdAt: "desc" },
            take: // if rest items are less than perPage, it means we are on the last page, so take only the remaining items
                skip >= 0 ? perPage : undefined,

            skip: skip
        });
        return c.json(messages.reverse());
    } catch (error) {
        return c.json({ error: "Failed to fetch messages" }, 500);
    }
});

export default chatRoutes;