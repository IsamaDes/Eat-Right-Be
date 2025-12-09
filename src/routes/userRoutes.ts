import { Router } from "express";
import { getCurrentUser, updateProfileController } from "../controllers/user/userController";
import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";


const router = Router();

router.use(protect);


router.get(
  "/me",
  getCurrentUser);

  router.patch("/update-profile", updateProfileController )

export default router;
