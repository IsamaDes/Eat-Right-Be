
import {Router} from "express";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";
import clientRoutes from "./clientRoutes";
import nutritionistRoutes from "./nutritionistRoutes";


var router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);
router.use("/nutritionist", nutritionistRoutes)

export default router;
