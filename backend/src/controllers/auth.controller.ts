import type { Context } from "hono";
import {UserService} from "../services/user.service";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const AuthController = {
  signup: async (c: Context) => {
    try {
      const body = await c.req.json();
      const user = await UserService.signupUser(body);
      return c.json(user, 201);
    }catch (err: any) {
      if(err.type === "validation") {
        return c.json(
          {
            message: "validation error",
            errors: err.errors,
          },
          400
        );
      }
      if(err.type == "duplicate") {
        return c.json(
          {
            message: err.message || "user already exists",
          },
          409
        );
      }

      return c.json({message: "internal server error"}, 500);
    }
  },

  signin: async (c: Context) => {
    try {
      const body = await c.req.json();
      const user = await UserService.signinUser(body);
      return c.json(user, 201);
    } catch(err: any) {
      if(err.type === "validation") {
        return c.json(
          {
            message: "validation error",
            errors: err.errors,
          },
          400
        );
      }
      if(err.type === "authentication") {
        return c.json(
          {
            message: "authentication error",
            errors: err.errors,
          },
          401
        );
      }

      return c.json({message: "internal server error"}, 500);
    }
  }
};
