
import { Context } from "hono";
import { UserService } from "../../services/userService";

export const UserController = {
    getUsers: async (c: Context) => {
    try {
      const users = await UserService.getAllUsers();
      return c.json(users);
    } catch (error) {
      return c.json({ message: "internal server error" }, 500);
    }
  },

  getUsersForChat: async (c: Context) => {
    try {
      const page = Number(c.req.query("page")) || 1;
      const keyword = c.req.query("keyword") || "";
      const perPage = Number(c.req.query("perPage")) || 5;
      const skip = (page - 1) * perPage;

      console.log("Received getUsersForChat request with:", { page, keyword, perPage });

      if (page <= 0 || perPage <= 0) {
        return c.json({ message: "invalid pagination parameters" }, 400);
      }

      const users = await UserService.getUsersForChat(skip, keyword, perPage);
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
  },
};