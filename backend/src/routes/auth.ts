import { Hono } from "hono";
import { AuthController } from "../controllers/auth.controller";

const auth = new Hono();

auth.post("/signup", AuthController.signup);
auth.post("/signin", AuthController.signin);

auth.get("/users", AuthController.getUsers);
auth.delete("/users/:id", AuthController.deleteUser);

export default auth;
