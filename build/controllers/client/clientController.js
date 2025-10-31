"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = require("../../repositories/userRepository");
// Returns the logged-in client's profile
const getClientProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            throw new Error("Invalid user Id");
        const client = await userRepository_1.UserRepository.findById(userId);
        res.status(200).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        console.error("Error fetching client profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.default = getClientProfile;
