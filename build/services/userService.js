"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserService = void 0;
const adminRepository_1 = require("../repositories/adminRepository");
const clientRepository_1 = require("../repositories/clientRepository");
const nutritionistRepository_1 = require("../repositories/nutritionistRepository");
const userRepository_1 = require("../repositories/userRepository");
const UserValidator_1 = require("../utils/validators/UserValidator");
exports.getUserService = {
    async getCurrentUserService(userId) {
        const user = await userRepository_1.UserRepository.findById(userId);
        if (!user)
            return null;
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
};
const updateUserProfile = async (userId, role, updates) => {
    let parsedInput;
    switch (role) {
        case "CLIENT":
            parsedInput = UserValidator_1.UpdateClientProfileSchema.parse(updates);
            if (Object.keys(parsedInput).length === 0) {
                throw new Error("No valid fields to update");
            }
            return await clientRepository_1.ClientRepository.updateClientProfile(userId, parsedInput);
        case "NUTRITIONIST":
            parsedInput = UserValidator_1.UpdateNutritionistProfileSchema.parse(updates);
            if (Object.keys(parsedInput).length === 0) {
                throw new Error("No valid fields to update");
            }
            return await nutritionistRepository_1.NutritionistRepository.updateNutritionistProfile(userId, parsedInput);
        case "ADMIN":
            parsedInput = UserValidator_1.UpdateAdminProfileSchema.parse(updates);
            if (Object.keys(parsedInput).length === 0) {
                throw new Error("No valid fields to update");
            }
            return await adminRepository_1.AdminRepository.updateAdminProfile(userId, parsedInput);
        default:
            throw new Error("Invalid user role");
    }
};
exports.updateUserProfile = updateUserProfile;
