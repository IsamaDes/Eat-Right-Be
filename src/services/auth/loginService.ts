// import type{ Response} from "express";
// import bcrypt from "bcryptjs";
// import jwt from  "jsonwebtoken";
// import sendAuthCookies from "../../utils/cookiesStore";
// import { UserRepository } from "../../repositories/userRepository";
// import { BadRequestError, UnauthorizedError } from "../../errors";


// const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
// const MAX_ATTEMPTS = 3;


// const loginUser = async (email: string, password: string, res: Response) => {
  

//   if (!email || !password) throw new BadRequestError("Email and password required");
//   const user = await UserRepository.findByEmail(email);

//   if (!user) throw new UnauthorizedError("Invalid credentials");

//   //Check if account is locked
//     if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
//     const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
//     throw new UnauthorizedError(`Account locked. Try again in ${minutesLeft} minutes`);
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     // Increment failed attempts
//     user.loginAttempts = (user.loginAttempts || 0) + 1;

//     // Lock if attempts exceed max
//     if (user.loginAttempts >= MAX_ATTEMPTS) {
//       user.lockUntil = new Date(Date.now() + LOCK_TIME);
//       user.loginAttempts = 0; 
//       await UserRepository.updateUser(user.id, {
//         loginAttempts: user.loginAttempts,
//         lockUntil: user.lockUntil
//       });
//     throw new UnauthorizedError("Invalid credentials");
//   }
    
//   // Reset failed attempts if successful
//   await UserRepository.updateUser(user.id, {
//      loginAttempts: 0,
//      lockUntil: null,
//   });

//   const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
//     expiresIn: "30m",
//   });
//   const refreshToken = jwt.sign(
//     { userId: user.id },
//     process.env.JWT_REFRESH_SECRET!,
//     { expiresIn: "7d" } 
//   );

// // Store tokens in secure cookies
//   sendAuthCookies(res, accessToken, refreshToken);

//   return {
//     success: true,
//     message: "Login successful",
//     data: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   };
// };
// }
// export default  loginUser;








import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendAuthCookies from "../../utils/cookiesStore";
import { UserRepository } from "../../repositories/userRepository";
import { BadRequestError, UnauthorizedError } from "../../errors";

const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;

const loginUser = async (email: string, password: string, res: Response) => {
  if (!email || !password) throw new BadRequestError("Email and password required");
  
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new UnauthorizedError("Invalid credentials");

  // Check if account is locked
  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    throw new UnauthorizedError(`Account locked. Try again in ${minutesLeft} minutes`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    // Increment failed attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    // Lock if attempts exceed max
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      user.loginAttempts = 0;
      await UserRepository.updateUser(user.id, {
        loginAttempts: user.loginAttempts,
        lockUntil: user.lockUntil
      });
      throw new UnauthorizedError(`Account locked. Try again in ${Math.ceil(LOCK_TIME / 60000)} minutes`);
    }

    // Update failed attempts
    await UserRepository.updateUser(user.id, {
      loginAttempts: user.loginAttempts,
    });
    
    throw new UnauthorizedError("Invalid credentials");
  } 
  await UserRepository.updateUser(user.id, {
    loginAttempts: 0,
    lockUntil: null,
  });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "30m" }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  // Store tokens in secure cookies
  sendAuthCookies(res, accessToken, refreshToken);

  return {
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken, 
    },
  };
};

export default loginUser;