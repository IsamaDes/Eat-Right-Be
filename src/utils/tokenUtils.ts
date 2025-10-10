const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/**
 * Generates a random token and returns both the plain token (for sending to the user)
 * and its bcrypt hash (for storing securely in the database).
 */
 function generateTokenAndHash() {
  // 1️⃣ Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");

  // 2️⃣ Hash the token using bcrypt
  const saltRounds = 10;
  const tokenHash = bcrypt.hashSync(token, saltRounds);

  // 3️⃣ Return both
  return { token, tokenHash };
}

module.exports = generateTokenAndHash;