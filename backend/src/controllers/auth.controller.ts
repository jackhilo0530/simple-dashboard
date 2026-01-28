import type { Context } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const AuthController = {
  signup: async (c: Context) => {
    const { email, password, firstName, lastName } = await c.req.json();
    
    if (!email || !password || !firstName || !lastName) return c.json({ error: "Email and password required" }, 400);
    const name = firstName + lastName;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: "Email already exists" }, 400);

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return c.json({ id: user.id, email: user.email, token });
  },

  signin: async (c: Context) => {
    const { email, password } = await c.req.json();

    if (!email || !password) return c.json({ error: "Email and password required" }, 400);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ error: "User not found" }, 404);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return c.json({ id: user.id, email: user.email, token });
  },
};
