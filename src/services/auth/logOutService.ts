import jwt from "jsonwebtoken";
import { TokenRepository } from "../../repositories/tokenRepository";
import { BadRequestError, UnauthorizedError } from "../../errors";

interface DecodedToken {
  exp: number;
  userId: string;
}


const logoutUser = async (refreshToken: string): Promise<void> => {
    try{
  const decoded = jwt.decode(refreshToken) as DecodedToken;
   if (!decoded || !decoded.exp) {
      throw new UnauthorizedError("Invalid token format");
    }
  const expiresAt = new Date(decoded.exp * 1000);

  await TokenRepository.blacklistToken(refreshToken, expiresAt);

}
  catch(error){
    throw new BadRequestError(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default logoutUser;