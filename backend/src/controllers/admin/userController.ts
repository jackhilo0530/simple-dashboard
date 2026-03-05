
import { Context } from "hono";
import { UserService } from "../../services/admin/userService";

export const UserController = {
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
  },
};