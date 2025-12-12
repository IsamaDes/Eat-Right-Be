"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = require("../../repositories/userRepository");
const errors_1 = require("../../errors");
const UserValidator_1 = require("../../utils/validators/UserValidator");
const zod_1 = require("zod");
const clientRepository_1 = require("../../repositories/clientRepository");
const nutritionistRepository_1 = require("../../repositories/nutritionistRepository");
const adminRepository_1 = require("../../repositories/adminRepository");
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (name, email, password, role, res) => {
    try {
        const parsedInput = UserValidator_1.RegisterSchema.parse({
            name,
            email,
            password,
            role,
        });
        const existing = await userRepository_1.UserRepository.findByEmail(parsedInput.email);
        if (existing)
            throw new errors_1.BadRequestError("User already exists");
        const hashedPassword = await bcrypt_1.default.hash(parsedInput.password, 10);
        const user = await prisma_1.prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    name: parsedInput.name,
                    email: parsedInput.email,
                    password: hashedPassword,
                    role: parsedInput.role,
                },
            });
            switch (parsedInput.role) {
                case "CLIENT":
                    await clientRepository_1.ClientRepository.createClientProfile(createdUser.id, tx);
                    break;
                case "NUTRITIONIST":
                    await nutritionistRepository_1.NutritionistRepository.createNutritionistUser(createdUser.id, tx);
                    break;
                case "ADMIN":
                    await adminRepository_1.AdminRepository.createAdminProfile(createdUser.id, tx);
                    break;
            }
            return createdUser;
        });
        console.log("Registration successful for:", user.email, user.id);
        return {
            success: true,
            message: "Registration successful",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new errors_1.BadRequestError(`Validation error: ${JSON.stringify(error.issues)}`, error.issues);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new errors_1.BadRequestError("Unknown error occurred during registration");
    }
};
exports.default = registerUser;
