// src/controllers/authController.ts
import { Request, Response } from "express";
import { refreshAccessToken }from "../services/auth/refreshTokenService.js";

 const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const newAccessToken = await refreshAccessToken(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error("Refresh token error:", err.message);
    res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
  }
};

export default refreshTokenController;