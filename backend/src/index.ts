import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {serveStatic} from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import {jwt} from "hono/jwt";
import dotenv from "dotenv";
import auth from "./routes/auth";
import product from "./routes/product";
import shopProduct from "./routes/shopProduct";
import order from "./routes/order";


dotenv.config();

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [`${process.env.FRONTEND_URL}` || "http://localhost:5173"],  // <-- frontend url
  })
);


app.route("/api/auth", auth);

app.use("/api/shopProducts/*", jwt({ secret: process.env.JWT_SECRET || "secret", alg: "HS256" }));

app.route("/api/products", product);

app.route("/api/shopProducts", shopProduct);

app.route("/api/orders", order);

app.use("/api/uploads/*", serveStatic({root: './public', rewriteRequestPath: (path) => path.replace("/api", "") }));


const port = 3000;

console.log(`Backend running at http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});