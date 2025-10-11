const BlacklistedToken = require("../../models/BlackListedToken")

const jwt = require("jsonwebtoken");
const User = require("../../models/User");


const logoutUser = async (refreshToken: string) => {
  const decoded = jwt.decode(refreshToken) as any;
  const expiresAt = new Date(decoded.exp * 1000);

  await BlacklistedToken.create({ token: refreshToken, expiresAt });

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = "";
    await user.save();
  }
};

module.exports = logoutUser;