import { Hono } from "hono";
import { UserController } from "../../controllers/admin/userController";

const user = new Hono();

user.get("/", UserController.getUsers);
user.delete("/:id", UserController.deleteUser);

export default user;