import User from "../../models/User";
/**
 * GET /api/client/profile
 * Returns the logged-in client's profile
 */
export const getClientProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const client = await User.findById(userId).select("-password -tokenHash -tokenExpiry");
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
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
