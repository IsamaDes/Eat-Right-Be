import BlacklistedToken from "../models/BlackListedToken.js";

export const TokenRepository = {
  async blacklistToken(refreshToken: string, expiresAt: Date) {
    return await BlacklistedToken.create({ token: refreshToken, expiresAt });
  },

  async isTokenBlacklisted(refreshToken: string) {
    const token = await BlacklistedToken.findOne({ token: refreshToken });
    return !!token; 
  },
};
