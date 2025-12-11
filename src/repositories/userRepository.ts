import { prisma,  } from "../lib/prisma";
import { UserRole } from "@prisma/client"; 
import { NotFoundError } from "../errors";
import { RegisterSchema, RegisterInput} from "../utils/validators/UserValidator";
import bcrypt from "bcryptjs"

export const UserRepository = {

  async createBaseUser(data: RegisterInput){
    const parsed = RegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    return prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        password: hashedPassword,
        role: parsed.role,
      },
    })
  },

   async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        clientProfile: true,
        nutritionistProfile: true,
        adminProfile: true,
      },
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

   async updateUser(id: string, updates: any) {
    return prisma.user.update({
      where: { id },
      data: updates,
    });
  },

 async countByRole(role: UserRole) {
    return prisma.user.count({ where: { role } });
  },

  async findAllUsersByRole(role: UserRole) {
    return prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        clientProfile: role === "CLIENT" ? { select: { id: true } } : undefined,
        nutritionistProfile: role === "NUTRITIONIST" ? { select: { id: true } } : undefined,
        adminProfile: role === "ADMIN" ? { select: { id: true } } : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  },

    async findLatestUsersByRole(role: UserRole, limit = 5) {
    return prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  },


  async deleteAll() {
    return prisma.user.deleteMany({});
  },
}