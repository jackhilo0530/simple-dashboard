import type { Context } from "hono";
import { UserService } from "../services/user.service";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const AuthController = {
  signup: async (c: Context) => {
    try {
      const body = await c.req.parseBody();
      const user = await UserService.signupUser(body);
      return c.json(user, 201);
    } catch (err: any) {
      if (err.type === "validation") {
        return c.json(
          {
            message: "validation error",
            errors: err.errors,
          },
          400
        );
      }
      if (err.type == "duplicate") {
        return c.json(
          {
            message: err.message || "user already exists",
          },
          409
        );
      }

      return c.json({ message: "internal server error" }, 500);
    }
  },

  signin: async (c: Context) => {
    try {
      const body = await c.req.json();
      const user = await UserService.signinUser(body);
      return c.json(user, 201);
    } catch (err: any) {
      if (err.type === "validation") {
        return c.json(
          {
            message: "validation error",
            errors: err.errors,
          },
          400
        );
      }
      if (err.type === "authentication") {
        return c.json(
          {
            message: "Email or password doesn't exist",
            errors: err.errors,
          },
          401
        );
      }

      return c.json({ message: "internal server error" }, 500);
    }
  },
  getUsers: async (c: Context) => {
    try {
      const users = await UserService.getAllUsers();
      return c.json(users);
    } catch (error) {
      return c.json({ message: "internal server error" }, 500);
    }
  },

  deleteUser: async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      if (Number.isNaN(id) || id <= 0) {
        return c.json({ message: "invalid user id" }, 400);
      }
      await UserService.deleteUser(id);
      return c.json({ message: "user deleted successfully" });
    } catch (error) {
      return c.json({ message: "internal server error" }, 500);
    }
  }
};
