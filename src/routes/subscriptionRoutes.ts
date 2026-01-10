import express from "express";
import {
  createSubscriptionController,
  verifyPayment,
  verifyPaymentTest,

} from "../controllers/subscriptionController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.get("/verify-payment", verifyPayment);
router.get("/verify-payment-test", verifyPaymentTest);

router.use(protect)

router.post("/create-subscription", createSubscriptionController);


export default router;
