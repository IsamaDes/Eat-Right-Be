import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";

export const cacheMiddleware = (
  keyGenerator: (req: Request) => string | null, 
  ttl = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
         const userId = req.user?._id;
         if (userId) return next();

      const key = keyGenerator(req);
      if (!key) return next();

      const cachedData = await redis.get(key);
      if (cachedData) {
        console.log(`⚡ Cache hit: ${key}`);
        return res.status(200).json({
          success: true,
          data: JSON.parse(cachedData),
          cached: true
        });
      }

      // Capture res.send to cache response automatically
      const originalSend = res.send.bind(res);
      res.send = (body: any) => {
        if (res.statusCode === 200) {
          redis.set(key, body, "EX", ttl).catch(err => console.error("Redis set failed:", err));
        }
        return originalSend(body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
};
