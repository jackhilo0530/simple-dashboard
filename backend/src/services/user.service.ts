import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z.string().min(2).trim(),
    img: z.union([z.string().url(), z.instanceof(File)]).optional(),
    role: z.nativeEnum(UserRole).default(UserRole.USER),

});

type SignupData = z.infer<typeof signupSchema>;

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const UserService = {
    signupUser: async (data: unknown) => {
        const parsed = signupSchema.safeParse(data);
        console.log("Parsed signup data:", data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.user.findUnique({
            where: { email: parsed.data.email },
        });

        if (existing) {
            throw { type: "duplicate", message: "email already exists" };
        }

        const hashed = await bcrypt.hash(parsed.data.password, 10);

        const user = await prisma.user.create({
            data: {
                username: parsed.data.username,
                email: parsed.data.email,
                password_hash: hashed,
                img_url: parsed.data.img?.toString() || null,
                role: parsed.data.role,
            }
        });
    
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        return {
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
            token,
        };
    },

    signinUser: async (data: unknown) => {
        const parsed = signinSchema.safeParse(data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
        });

        if (!user) {
            throw { type: "authentication", message: "email or password doesn't exist" };
        }

        const isMatch = await bcrypt.compare(parsed.data.password, user.password_hash);
        if (!isMatch) {
            throw { type: "authentication", message: "email or password doesn't exist" };
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        return {
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
            token,
        };
    },
};


