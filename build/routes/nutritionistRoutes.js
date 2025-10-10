"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { getNutritionistProfile, getClients } = require("../controllers/nutritionist/nutritionistController");
// Nutritionist-only routes
router.get("/profile", protect, authorizeRoles("nutritionist"), getNutritionistProfile);
router.get("/clients", protect, authorizeRoles("nutritionist"), getClients);
module.exports = router;
