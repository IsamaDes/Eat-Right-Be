import { Request, Response } from "express";
import {
  createSubscriptionService,
  initializeSubscriptionPaymentService,
  verifyPaymentService,
} from "../services/subscriptionService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const createSubscriptionController = async (req: AuthenticatedRequest, res: Response) => {
   
      const payload = req.body;
  try {
    const subscription = await createSubscriptionService(payload);
    return res.status(201).json(subscription);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const initializePaymentController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const userEmail = req.user?.email;

    const payloadWithEmail = {
        ...req.body,
        email: userEmail
    }

    console.log("subscription id on initializing payment", subscriptionId)
    console.log("Initializing Paystack payment with payload:", payloadWithEmail);
    const response = await initializeSubscriptionPaymentService(subscriptionId, payloadWithEmail);

    return res.status(200).json(response);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    await verifyPaymentService(req, res);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).json({ error: "Webhook signature mismatch" });
  }
};
