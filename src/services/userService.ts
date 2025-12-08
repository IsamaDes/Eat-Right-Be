import { getCurrentUser } from "../controllers/user/userController";
import { UserRepository } from "../repositories/userRepository";

export const getUserService = {
    async getCurrentUserService(userId: string){
      const user = await UserRepository.findById(userId);
       if (!user) return null;
       let profile = null;
       switch (user.role) {
      case "CLIENT":
        profile = user.clientProfile;
        break;
      case "NUTRITIONIST":
        profile = user.nutritionistProfile;
        break;
      case "ADMIN":
        profile = user.adminProfile;
        break;
    }

     return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile,
    };
    }
}