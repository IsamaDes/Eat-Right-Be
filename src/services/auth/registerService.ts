const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const generateTokenAndHash = require("../../utils/tokenUtils");
const { validateRegistrationInput } = require("../../utils/validationUtils");


const registerUser = async (name: string, email: string, password: string, role: string) => {

  const { valid, errors, sanitized } = validateRegistrationInput({
    name,
    email,
    password,
  });

   if (!valid) {
    throw new Error(errors.join(" "));
  }

  const cleanEmail = sanitized.email.toLowerCase();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(sanitized.password, 10);

  const { token, tokenHash } = generateTokenAndHash();

  const user = new User({
    name: sanitized.name,
    email: cleanEmail,
    password: hashed,
    role,
    tokenHash,
    tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await user.save();

  return {
  
  id: user._id,
  email: user.email,
  role: user.role,
  token,

};
  
};

module.exports = registerUser;
