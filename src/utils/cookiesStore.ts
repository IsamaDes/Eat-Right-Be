import type { Response } from "express";

function sendAuthCookies(res: Response, accessToken: string, refreshToken: string) {
   console.log("🍪 Setting cookies with tokens:", { 
    accessToken: accessToken?.substring(0, 20) + "...", 
    refreshToken: refreshToken?.substring(0, 20) + "..."
  });

  const isDev = process.env.NODE_ENV !== "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: !isDev, // false in development
    sameSite: isDev ? "lax" : "none", 
    maxAge: 30 * 60 * 1000, // 30 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: !isDev, // false in development
    sameSite: isDev ? "lax" : "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log("✅ Cookies set successfully");
  console.log("📋 Response headers:", res.getHeaders());
}

export default sendAuthCookies;
