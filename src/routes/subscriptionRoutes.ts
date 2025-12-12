import express from "express";
import {
  createSubscriptionController,
  initializePaymentController,
  verifyPayment,

} from "../controllers/subscriptionController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect)

router.post("/create-subscription", createSubscriptionController);
router.post("/:subscriptionId/initialize-payment", initializePaymentController);

// Paystack webhook
router.post("/verify-payment", verifyPayment);

export default router;
