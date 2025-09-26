const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user minimal info to req
    const user = await User.findById(payload.id).select(
      "-password -tokenHash -tokenExpiry"
    );
    if (!user)
      return res.status(401).json({ message: "Invalid token: user not found" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: err.message });
  }
};

module.exports = auth;
