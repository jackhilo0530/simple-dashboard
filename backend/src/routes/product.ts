import {Hono} from "hono";
import {ProductController} from "../controllers/productController";

const product = new Hono();

product.get("/", ProductController.getProducts);
product.get("/category", ProductController.getProductsCategory);
product.get("/:id", ProductController.getProductById);


export default product;