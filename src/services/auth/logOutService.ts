import jwt from "jsonwebtoken";
import { UserRepository } from "../../repositories/userRepository.js";

interface DecodedToken {
  exp: number;
  userId: string;
}


const logoutUser = async (refreshToken: string): Promise<void> => {
    try{
  const decoded = jwt.decode(refreshToken) as DecodedToken;
   if (!decoded || !decoded.exp) {
      throw new Error("Invalid token format");
    }
  const expiresAt = new Date(decoded.exp * 1000);

  await UserRepository.createBlacklistedToken(refreshToken, expiresAt);

  const user = await UserRepository.findByRefreshToken(refreshToken);
  if (user) {
    user.refreshToken = "";
    await UserRepository.save(user);
  };
}
  catch(error){
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default logoutUser;