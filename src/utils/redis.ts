import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
};

const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("🔗 Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;