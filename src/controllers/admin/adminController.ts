import type { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { UserRepository } from "../../repositories/userRepository";

// * Returns basic stats for the admin dashboard
 const getAdminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Count users by role
    const [clientCount, nutritionistCount, adminCount] = await Promise.all([ 
      UserRepository.countByRole("client"),
      UserRepository.countByRole("nutritionist"),
      UserRepository.countByRole("admin"),]);

    // fetch latest users, etc.
    const latestClients = await UserRepository.findLatestByRole("client", 5)

    res.status(200).json({
      success: true,
      data: {
        total: { clients: clientCount, nutritionists: nutritionistCount, admins: adminCount },
        latestClients,
      },
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getAdminDashboard;