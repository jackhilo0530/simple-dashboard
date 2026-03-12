import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import z from "zod";
import { prisma } from "@repo/db";


const JWT_SECRET = process.env.JWT_SECRET || "secret";

enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z.string().min(2).trim(),
    img: z.instanceof(File).optional(),
    role: z.nativeEnum(UserRole).default(UserRole.USER),

});

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const uploadImage = async (buffer: Buffer, filename: string): Promise<string> => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const uploadPath = path.join(uploadDir, filename);
    await fs.promises.writeFile(uploadPath, buffer);
    return `/uploads/${filename}`;
};

export const UserService = {
    signupUser: async (data: unknown) => {
        const parsed = signupSchema.safeParse(data);
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

        let imgUrl = "";
        if (parsed.data.img) {
            const arrayBuffer = await parsed.data.img.arrayBuffer();
            const imgBuffer = Buffer.from(arrayBuffer);
            const imgName = crypto.randomUUID() + path.extname(parsed.data.img.name);
            imgUrl = await uploadImage(imgBuffer, imgName);
        }

        const user = await prisma.user.create({
            data: {
                username: parsed.data.username,
                email: parsed.data.email,
                password_hash: hashed,
                role: parsed.data.role,
                img_url: imgUrl,
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
    getAllUsers: async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                img_url: true,
                isLoggedIn: true,
                createdAt: true,
            },
        });
        return users;
    },
    deleteUser: async (userId: number) => {
        await prisma.user.delete({
            where: { id: userId },
        });
    },
};


