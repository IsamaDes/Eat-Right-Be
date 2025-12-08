// src/repositories/adminRepository.ts
import { prisma } from "../lib/prisma";
import { UpdateAdminProfileInput } from "../utils/validators/UserValidator";

export const AdminRepository = {
  async createAdminProfile(userId: string) {
    const AdminUser = await prisma.adminProfile.create({data: {userId}});
    return AdminUser;
  },

  async updateAdminProfile(userId: string, updates: Partial<UpdateAdminProfileInput>) {
    return prisma.adminProfile.update({
      where: { userId },
      data: updates,
    });
  }
};
