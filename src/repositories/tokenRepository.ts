import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const TokenRepository = {
  async blacklistToken(refreshToken: string, expiresAt: Date) {
    return await prisma.blacklistedToken.create({data: { token: refreshToken, expiresAt }});
  },

  async isTokenBlacklisted(refreshToken: string) {
    const token = await prisma.blacklistedToken.findFirst({where: { token: refreshToken }});
    return !!token; 
  },
};
