
const express = require('express');
const router = express.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes")
const clientRoutes = require("./clientRoutes");
const nutritionistRoutes = require("./nutritionistRoutes");


router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);
router.use("/nutritionist", nutritionistRoutes)

module.exports = router;
