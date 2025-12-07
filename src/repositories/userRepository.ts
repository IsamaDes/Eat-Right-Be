import { prisma,  } from "../lib/prisma";
import { UserRole } from "@prisma/client"; 
import { NotFoundError } from "../errors";

export const UserRepository = {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        clientProfile: true,
        nutritionistProfile: true,
        adminProfile: true,
      },
    });
    return user;
  },

  async findClientsByNutritionist(nutritionistId: string) {
    return prisma.clientProfile.findMany({
      where: { assignedNutritionistId: nutritionistId },
      include: { user: true },
    });
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        nutritionistProfile: true,
        adminProfile: true,
      },
    });

    if (!user) throw new NotFoundError(`User with ID ${id} not found`);
    return user;
  },

  async save(user: any) {
    return prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  },

  async create(userData: any) {
    return prisma.user.create({
      data: userData,
    });
  },

  async countByRole(role: string) {
    return prisma.user.count({
      where: { role: role as UserRole },
    });
  },

  async findAllUsersByRole(role: string) {
    return prisma.user.findMany({
      where: { role: role as UserRole },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        clientProfile: { select: { assignedNutritionistId: true } },
        nutritionistProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findLatestByRole(role: string, limit = 5) {
    return prisma.user.findMany({
      where: { role: role as UserRole },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async updateById(userId: string, updates: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });
    return user;
  },

  async deleteAll() {
    return prisma.user.deleteMany({});
  },
};
