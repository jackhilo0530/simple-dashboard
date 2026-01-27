import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors"
import dotenv from "dotenv";
import auth from "./routes/auth";
import product from "./routes/product";


dotenv.config();

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [`${process.env.FRONTEND_URL}` || "http://localhost:5173"],  // <-- frontend url
  })
);

app.route("/api/auth", auth);

app.route("/api/products", product);

const port = 3000;

console.log(`Backend running at http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});