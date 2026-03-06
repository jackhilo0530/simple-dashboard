import { Hono } from "hono";
import { OrderController } from "../../controllers/admin/orderController";

const order = new Hono();

order.get("/", OrderController.getOrders);
// order.get("/:id", OrderController.getOrderById);
// order.post("/", OrderController.createOrder);
// order.put("/:id", OrderController.updateOrder);
order.delete("/:id", OrderController.deleteOrder);
order.put("/:id/status", OrderController.updateOrderStatus);

export default order;