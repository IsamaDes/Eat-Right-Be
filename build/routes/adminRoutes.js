"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const adminDashboardController_1 = require("../controllers/admin/adminDashboardController");
const adminController_1 = require("../controllers/admin/adminController");
router.use(authMiddleware_1.default);
router.get("/dashboard", (0, roleMiddleware_1.default)("ADMIN"), adminDashboardController_1.getAdminDashboard);
router.get("/profile", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST", "CLIENT"), adminController_1.adminProfile);
router.get("/users/:id", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST"), adminDashboardController_1.getUserById);
router.patch("/assign-nutritionist", (0, roleMiddleware_1.default)("ADMIN"), adminDashboardController_1.assignNutritionistToClient);
router.get("/client/:clientId", adminController_1.getClientProfile);
exports.default = router;
