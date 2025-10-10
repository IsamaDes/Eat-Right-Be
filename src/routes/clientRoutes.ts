const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const  authorizeRoles  = require("../middleware/roleMiddleware");
const  getClientProfile  = require("../controllers/client/clientController");



// Clients can access their profile
router.get(
  "/profile",
  protect,                
  authorizeRoles("client"), 
  getClientProfile
);

module.exports = router;
