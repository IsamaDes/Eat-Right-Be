"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const roleMiddleware_js_1 = __importDefault(require("../middleware/roleMiddleware.js"));
const nutritionistController_js_1 = require("../controllers/nutritionist/nutritionistController.js");
router.use(authMiddleware_js_1.default);
// Nutritionist-only routes
router.get("/profile", (0, roleMiddleware_js_1.default)("nutritionist"), nutritionistController_js_1.getNutritionistProfile);
router.get("/clients", (0, roleMiddleware_js_1.default)("nutritionist"), nutritionistController_js_1.getClients);
router.post("/create", (0, roleMiddleware_js_1.default)("admin", "nutritionist"), nutritionistController_js_1.createMealPlan);
router.get("/", (0, roleMiddleware_js_1.default)("admin", "nutritionist", "client"), nutritionistController_js_1.getMealPlans);
router.put("/:id", (0, roleMiddleware_js_1.default)("admin", "nutritionist"), nutritionistController_js_1.updateMealPlan);
router.get("/:id", (0, roleMiddleware_js_1.default)("admin", "nutritionist", "client"), nutritionistController_js_1.getMealPlanById);
exports.default = router;
