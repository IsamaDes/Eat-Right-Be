"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const clientRoutes_1 = __importDefault(require("./clientRoutes"));
const nutritionistRoutes_1 = __importDefault(require("./nutritionistRoutes"));
var router = (0, express_1.Router)();
router.use("/auth", authRoutes_1.default);
router.use("/admin", adminRoutes_1.default);
router.use("/client", clientRoutes_1.default);
router.use("/nutritionist", nutritionistRoutes_1.default);
exports.default = router;
