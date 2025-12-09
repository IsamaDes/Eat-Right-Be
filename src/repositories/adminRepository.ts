// src/repositories/adminRepository.ts
import { prisma } from "../lib/prisma";
import { UpdateAdminProfileInput } from "../utils/validators/UserValidator";

export const AdminRepository = {
  async createAdminProfile(userId: string) {
    const AdminUser = await prisma.adminProfile.create({
      data: {userId},  include: {
      user: true, 
    },
  });
    return AdminUser;
  },

   async getAdminProfile(userId: string){
    const user = await prisma.user.findUnique({
         where: { id: userId },
         include: {
           adminProfile: true,  
        },
    })
     if (!user) return null;
     return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.adminProfile,
  };
  },

  async updateAdminProfile(userId: string, updates: Partial<UpdateAdminProfileInput>) {
    return prisma.adminProfile.update({
      where: { userId },
      data: updates,
    });
  }
};
