import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import z from "zod";
import { prisma } from "../lib/prisma";

const shopProductSchema = z.object({
    name: z.string().min(2).trim(),
    description: z.string().min(5).trim(),
    sku: z.string().min(2).trim(),
    category: z.string().min(2).trim(),
    img: z.instanceof(File).optional(),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Price must be a non-negative number",
    }),
    compareAtPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Compare at price must be a non-negative number",
    }).optional(),
    stockQuantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Stock quantity must be a non-negative number",
    }).optional()
});

type ShopProductData = z.infer<typeof shopProductSchema>;

const uploadImage = async (buffer: Buffer, filename: string): Promise<string> => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const uploadPath = path.join(uploadDir, filename);
    await fs.writeFile(uploadPath, buffer);
    return `/uploads/${filename}`;
}

export const ShopProductService = {
    fetchShopProducts: async () => {
        const products = await prisma.product.findMany();
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));
        return products.map((product) => ({
            ...product,
            category: categoryMap.get(product.category_id) || "Uncategorized",
        }));
    },
    fetchShopProduct: async (id: number) => {
        return await prisma.product.findUnique({ where: { id } });
    },
    createShopProduct: async (data: unknown) => {
        const parsed  = shopProductSchema.safeParse(data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.product.findUnique({
            where: { sku: parsed.data.sku }
        });

        if (existing) {
            throw { type: "duplicate", message: "product with this SKU already exists" };
        }

        let imgUrl = "";
        if (parsed.data.img) {
            const arrayBuffer = await parsed.data.img.arrayBuffer();
            const imgBuffer = Buffer.from(arrayBuffer);
            const imgName = crypto.randomUUID() + path.extname(parsed.data.img.name);
            imgUrl = await uploadImage(imgBuffer, imgName);

        }

        let category_id = null;

        const existingCategory = await prisma.category.findFirst({
            where: { name: parsed.data.category },
            select: { id: true },
        });

        if (!existingCategory) {
            const newCategory = await prisma.category.create({
                data: { name: parsed.data.category },
                select: { id: true },
            });
            category_id = newCategory.id;
        } else {
            category_id = existingCategory.id;
        }


        const product = await prisma.product.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description,
                sku: parsed.data.sku,
                price: Number(parsed.data.price),
                complete_at_price: parsed.data.compareAtPrice ? Number(parsed.data.compareAtPrice) : Number(parsed.data.price),
                stock_quantity: Number(parsed.data.stockQuantity) || 0,
                category_id,
                img_url: imgUrl,
            }
        });


        return product;
    },
    updateShopProduct: async (id: number, data: unknown) => {
        const parsed = shopProductSchema.partial().safeParse(data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.product.findUnique({
            where: { id }
        });
        
        if (!existing) {
            return null;
        } else {
            let imgUrl = existing.img_url;
            if (parsed.data.img) {
                const arrayBuffer = await parsed.data.img.arrayBuffer();
                const imgBuffer = Buffer.from(arrayBuffer);
                const imgName = crypto.randomUUID() + path.extname(parsed.data.img.name);
                imgUrl = await uploadImage(imgBuffer, imgName);
            }

            let category_id = existing.category_id;

            if (parsed.data.category) {
                const existingCategory = await prisma.category.findFirst({
                    where: { name: parsed.data.category },
                    select: { id: true },
                });

                if (!existingCategory) {
                    const newCategory = await prisma.category.create({
                        data: { name: parsed.data.category },
                        select: { id: true },
                    });
                    category_id = newCategory.id;
                } else {
                    category_id = existingCategory.id;
                }
            }

            const product = await prisma.product.update({
                where: { id },
                data: {
                    name: parsed.data.name || existing.name,
                    description: parsed.data.description || existing.description,
                    sku: parsed.data.sku || existing.sku,
                    price: parsed.data.price ? Number(parsed.data.price) : existing.price,
                    complete_at_price: parsed.data.compareAtPrice ? Number(parsed.data.compareAtPrice) : existing.complete_at_price,
                    stock_quantity: parsed.data.stockQuantity ? Number(parsed.data.stockQuantity) : existing.stock_quantity,
                    category_id,
                    img_url: imgUrl,
                }
            });

            return product;
        }
    },
    deleteShopProduct: async (id: number) => {
        const existing = await prisma.product.findUnique({
            where: { id }
        });

        if (!existing) {
            return null;
        } else {
            await prisma.product.delete({
                where: { id }
            });
            return existing;
        }
    }
}