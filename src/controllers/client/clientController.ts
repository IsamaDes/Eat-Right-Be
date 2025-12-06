import { Response } from "express";
import { UserRepository } from "../../repositories/userRepository";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { UnauthorizedError } from "../../errors";


// Returns the logged-in client's profile
 export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if(!userId) throw new Error("Invalid user Id")

    const client = await UserRepository.findById(userId)

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    console.error("Error fetching client profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

