import { AdminRepository } from "../repositories/adminRepository";
import { ClientRepository } from "../repositories/clientRepository";
import { NutritionistRepository } from "../repositories/nutritionistRepository";
import { UserRepository } from "../repositories/userRepository";
import { UpdateClientProfileSchema, UpdateNutritionistProfileSchema, UpdateAdminProfileSchema, UpdateClientProfileInput, UpdateNutritionistProfileInput, UpdateAdminProfileInput } from "../utils/validators/UserValidator";

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



export const updateUserProfile = async (
  userId: string, 
  role: string, 
  updates: Record<string, any>
) => {
  let parsedInput: any;

  // Parse and validate based on role
  switch (role) {
    case "CLIENT":
      parsedInput = UpdateClientProfileSchema.parse(updates);
      
      
      if (Object.keys(parsedInput).length === 0) {
        throw new Error("No valid fields to update");
      }
      
      return await ClientRepository.updateClientProfile(userId, parsedInput);

    case "NUTRITIONIST":
      parsedInput = UpdateNutritionistProfileSchema.parse(updates);
      
      if (Object.keys(parsedInput).length === 0) {
        throw new Error("No valid fields to update");
      }
      
      return await NutritionistRepository.updateNutritionistProfile(userId, parsedInput);

    case "ADMIN":
      parsedInput = UpdateAdminProfileSchema.parse(updates);
      
      if (Object.keys(parsedInput).length === 0) {
        throw new Error("No valid fields to update");
      }
      
      return await AdminRepository.updateAdminProfile(userId, parsedInput);

    default:
      throw new Error("Invalid user role");
  }
};