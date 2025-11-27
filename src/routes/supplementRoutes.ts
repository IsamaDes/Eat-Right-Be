import { Router } from "express";
import protect from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/roleMiddleware";

import { createSupplement, createCategory, getCategories, getSupplementsByCategory } from "../controllers/admin/supplementController";


const router = Router();

router.post(
  "/admin/supplement-categories",
  protect,
  authorizeRoles("admin"),
  createCategory
);

router.post(
  "/admin/supplements",
  protect,
  authorizeRoles("admin"),
  createSupplement
);


router.get("/store/categories", getCategories);

router.get("/store/categories/:id/supplements", getSupplementsByCategory);

export default router;
