"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const nutritionistController_1 = require("../controllers/nutritionist/nutritionistController");
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
router.use(authMiddleware_1.default);
// Nutritionist-only routes
router.get("/profile", (0, roleMiddleware_1.default)("NUTRITIONIST"), (0, cacheMiddleware_1.cacheMiddleware)(req => `nutritionist:profile:${req.user?.id}`, 3600), nutritionistController_1.getNutritionistProfile);
router.get("/clients", (0, roleMiddleware_1.default)("NUTRITIONIST"), (0, cacheMiddleware_1.cacheMiddleware)(req => `nutritionist:clients:${req.user?.id}`, 1800), nutritionistController_1.getClients);
router.post("/create", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST"), nutritionistController_1.createMealPlan);
router.get("/", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST", "CLIENT"), (0, cacheMiddleware_1.cacheMiddleware)(req => `mealplans:user:${req.user?.id}`, 600), nutritionistController_1.getMealPlans);
router.put("/:id", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST"), nutritionistController_1.updateMealPlan);
router.get("/dashboard", (0, roleMiddleware_1.default)("NUTRITIONIST"), (0, cacheMiddleware_1.cacheMiddleware)(req => `nutritionist:dashboard:${req.user?.id}`, 600), nutritionistController_1.getNutritionistDashboard);
router.get("/:id", (0, roleMiddleware_1.default)("ADMIN", "NUTRITIONIST", "CLIENT"), (0, cacheMiddleware_1.cacheMiddleware)(req => `mealplan:${req.params.id}`, 600), nutritionistController_1.getMealPlanById);
exports.default = router;
