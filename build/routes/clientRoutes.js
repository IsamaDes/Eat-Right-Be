"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const roleMiddleware_js_1 = __importDefault(require("../middleware/roleMiddleware.js"));
const clientController_js_1 = __importDefault(require("../controllers/client/clientController.js"));
// Clients can access their profile
router.get("/profile", authMiddleware_js_1.default, (0, roleMiddleware_js_1.default)("client"), clientController_js_1.default);
exports.default = router;
