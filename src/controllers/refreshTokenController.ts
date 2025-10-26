import { Request, Response } from "express";
import { refreshAccessToken } from "../services/auth/refreshTokenService";

 const refreshTokenController = async (req: Request, res: Response) => {
  try {
   await refreshAccessToken(req, res);
  } catch (err: any) {
    console.error("Refresh token error:", err.message);
    res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
  }
};

export default refreshTokenController;