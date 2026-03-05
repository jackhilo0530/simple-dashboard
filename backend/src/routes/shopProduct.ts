import { Hono } from "hono";
import { ShopProductController } from "../controllers/shopProductController";

const shopProduct = new Hono();

shopProduct.get("/", ShopProductController.getShopProducts);
shopProduct.get("/:id", ShopProductController.getShopProductById);
shopProduct.post("/", ShopProductController.createShopProduct);
shopProduct.put("/:id", ShopProductController.updateShopProduct);
shopProduct.delete("/:id", ShopProductController.deleteShopProduct);

export default shopProduct;