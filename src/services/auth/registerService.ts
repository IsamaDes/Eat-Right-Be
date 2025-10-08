import bcrypt from "bcryptjs";
import User from "../../models/User"
import generateTokenAndHash from "../../utils/tokenUtils"

async function registerUser(name: string, email: string, password: string) {
  if (!email || !password) throw new Error("Email and password required");

  console.log(email);
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email: email.toLowerCase(),
    password: hashed,
  });

  const { token, tokenHash } = generateTokenAndHash();
  user.tokenHash = tokenHash;
  user.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  await user.save();

  return {
    message: "User created. Verify email to activate account.",
    verificationToken: token,
  };
}
export default registerUser;
