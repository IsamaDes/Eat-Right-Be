"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const nutritionistController_1 = require("../controllers/nutritionist/nutritionistController");
const router = (0, express_1.Router)();
// Nutritionist-only routes
router.get("/profile", authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)("nutritionist"), nutritionistController_1.getNutritionistProfile);
router.get("/clients", authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)("nutritionist"), nutritionistController_1.getClients);
exports.default = router;
