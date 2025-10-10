import bcrypt from "bcryptjs";
import User from "../../models/User";
import generateTokenAndHash from "../../utils/tokenUtils";
const registerUser = async (name, email, password, role) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcrypt.hash(password, 10);
    const { token, tokenHash } = generateTokenAndHash();
    const user = new User({
        name,
        email: email.toLowerCase(),
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
export default registerUser;
