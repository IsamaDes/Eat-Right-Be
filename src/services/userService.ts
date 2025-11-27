import { UserRepository } from "../repositories/userRepository";
import { NotFoundError } from "../errors";
import redis from "../utils/redis";

export const getUserProfileService = async (userId: string) => {
  const user = await UserRepository.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  
  return user;
};

export const updateUserProfileService = async (userId: string, updates: any) => {
  const updatedUser = await UserRepository.updateById(userId, updates);

  // Invalidate Redis cache so middleware fetches fresh data next time
    await redis.del(`user:${userId}`);

  return updatedUser;
};
