import { Request, Response } from "express";
import {
  createSubscriptionService,
  initializeSubscriptionPaymentService,
  verifyPaystackWebhook,
} from "../services/subscriptionService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const createSubscriptionController = async (req: AuthenticatedRequest, res: Response) => {
    const subscriberId = req.user?._id
     if (!subscriberId) {
      return res.status(401).json({ error: "Unauthorized: subscriberId not found" });
    }

      const payload = {
      ...req.body,
      subscriberId,
    };
  try {
    const subscription = await createSubscriptionService(payload);
    return res.status(201).json(subscription);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const initializePaymentController = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const response = await initializeSubscriptionPaymentService(subscriptionId, req.body);

    return res.status(200).json(response);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const paystackWebhookController = async (req: Request, res: Response) => {
  try {
    await verifyPaystackWebhook(req);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).json({ error: "Webhook signature mismatch" });
  }
};
