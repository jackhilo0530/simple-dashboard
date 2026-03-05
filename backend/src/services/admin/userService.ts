import { prisma } from "../../lib/prisma";


export const UserService = {
    getAllUsers: async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                img_url: true,
            },
        });
        return users;
    },
    deleteUser: async (userId: number) => {
        await prisma.user.delete({
            where: { id: userId },
        });
    },
};