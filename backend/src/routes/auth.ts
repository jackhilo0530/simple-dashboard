import { Hono } from "hono";
import { AuthController } from "../controllers/auth.controller";

const auth = new Hono();

auth.post("/signup", AuthController.signup);
auth.post("/signin", AuthController.signin);

export default auth;
