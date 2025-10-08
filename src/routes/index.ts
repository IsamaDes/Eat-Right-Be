
import express from "express";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";
import clientRoutes from "./clientRoutes";
import nutritionistRoutes from "./nutritionistRoutes";


var router = express.Router();


/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index", { title: "Express" });
});

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);
router.use("/nutritionist", nutritionistRoutes)

export default router;
