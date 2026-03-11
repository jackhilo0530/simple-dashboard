import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import chatRoutes from "./routes/chat.js";
import { setupSocketHandlers } from "./socket/handler.js";

const app = new Hono();

// Mount HTTP routes
app.route("/api/messages", chatRoutes);

// Create the server
const server = serve({
    fetch: app.fetch,
    port: 4000,
}, (info) => {
    console.log(`🚀 Chat Server running on port ${info.port}`);
});

// Initialize Socket.io
const io = new Server(server as HttpServer, {
    cors: { origin: "*" },
});

// Attach handlers
setupSocketHandlers(io);