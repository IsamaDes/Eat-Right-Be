"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const clientController_1 = require("../controllers/client/clientController");
router.get("/profile", authMiddleware_1.default, clientController_1.getClientProfile);
router.get("/meal-plans", authMiddleware_1.default, clientController_1.getClientMealPlans);
router.get("/meal-schedule", authMiddleware_1.default, clientController_1.getClientMealSchedule);
exports.default = router;
