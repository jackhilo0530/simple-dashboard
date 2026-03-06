import { Hono } from "hono";
import user from "./user";
import product from "./product";
import shopProduct from "./shopProduct";
import order from "./order";
import shipment from "./shipment";

const admin = new Hono();

admin.route("/users", user);
admin.route("/products", product);
admin.route("/shopProducts", shopProduct);
admin.route("/orders", order);
admin.route("/shipments", shipment);

export default admin;