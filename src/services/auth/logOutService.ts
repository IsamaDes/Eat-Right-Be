const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const BlacklistedToken = require("../../models/BlackListedToken")

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

  await BlacklistedToken.create({ token: refreshToken, expiresAt });

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = "";
    await user.save();
  };
}
  catch(error){
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

module.exports = logoutUser;