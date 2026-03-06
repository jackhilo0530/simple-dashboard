import { Context } from "hono";
import { ShopProductService } from "../../services/shopProduct";


export const ShopProductController = {
    getShopProducts: async (c: Context) => {
        try {
            const prodcuts = await ShopProductService.fetchShopProducts();
            return c.json(prodcuts);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    getShopProductById: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const product = await ShopProductService.fetchShopProduct(id);
            if (!product) {
                return c.json({ message: "product not found" }, 404);
            }
            return c.json(product);
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    },
    createShopProduct: async (c: Context) => {
        try {
            const body = await c.req.parseBody();
            const product = await ShopProductService.createShopProduct(body);
            return c.json(product, 201);
        } catch (err: any) {
            if (err.type === "validation") {
                return c.json({
                    message: "validation error",
                    errors: err.errors,
                }, 400);
            }
            return c.json({ message: "internal server error" }, 500);
        }
    },
    updateShopProduct: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            const body = await c.req.parseBody();
            const product = await ShopProductService.updateShopProduct(id, body);
            if (!product) {
                return c.json({ message: "product not found" }, 404);
            }
            return c.json(product);
        } catch (err: any) {
            if (err.type === "validation") {
                return c.json({
                    message: "validation error",
                    errors: err.errors,
                }, 400);
            }
            return c.json({ message: "internal server error" }, 500);
        }
    },
    deleteShopProduct: async (c: Context) => {
        try {
            const id = Number(c.req.param("id"));
            if (Number.isNaN(id) || id <= 0) {
                return c.json({ message: "invalid id" }, 400);
            }
            await ShopProductService.deleteShopProduct(id);
            return c.json({ message: "product deleted successfully" });
        } catch (error) {
            return c.json({ message: "internal server error" }, 500);
        }
    }
}