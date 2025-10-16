import jwt from "jsonwebtoken";

/**
 * Generate a short-lived access token (e.g. 15 minutes)
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

/**
 * Generate a long-lived refresh token (e.g. 7 days)
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};
