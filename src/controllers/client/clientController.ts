import { Request, Response } from "express";
import User from "../../models/User";

// Extend Request type for TypeScript
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * GET /api/client/profile
 * Returns the logged-in client's profile
 */
export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const client = await User.findById(userId).select(
      "-password -tokenHash -tokenExpiry"
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    console.error("Error fetching client profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
