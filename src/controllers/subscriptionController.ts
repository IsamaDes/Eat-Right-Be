import { Request, Response } from "express";
import {
  createSubscriptionService,
  verifyPaymentService,
  verifyPaymentTestService,
  
} from "../services/subscriptionService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";


/**
 * @swagger
 * tags:
 *   - name: Subscriptions
 *     description: Manage client subscriptions and payments
 */

/**
 * @swagger
 * /subscriptions/create-subscription:
 *   post:
 *     summary: Create a subscription and initialize payment
 *     description: >
 *       Creates a subscription for the authenticated client and initializes
 *       a Paystack payment transaction in one atomic operation.
 *     tags:
 *       - Subscriptions
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planName
 *               - amount
 *               - billingInterval
 *               - billingCycleCount
 *               - gateway
 *               - redirectUrl
 *             properties:
 *               planName:
 *                 type: string
 *                 example: Premium Plan
 *               clientEmail:
 *                 type: string
 *                 example: destiny@email.com
 *               amount:
 *                 type: number
 *                 example: 90000
 *               billingInterval:
 *                 type: string
 *                 enum: [daily, weekly, monthly, quarterly, yearly]
 *                 example: monthly
 *               billingCycleCount:
 *                 type: number
 *                 example: 1
 *               currency:
 *                 type: string
 *                 example: NGN
 *               gateway:
 *                 type: string
 *                 example: paystack
 *               redirectUrl:
 *                 type: string
 *                 example: https://abc123.ngrok.io/dummy-success
 *               reference:
 *                 type: string
 *                 example: sub_test_reference_123
 *               metadata:
 *                 type: object
 *                 properties:
 *                   autoRenew:
 *                     type: boolean
 *                     example: true
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Initial Consultation", "2 Weeks Meal Plan", "20mins Follow Up Consultations"]
 *     responses:
 *       201:
 *         description: Subscription created and payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cmk5qvnjq000110ycg3ipsgj4
 *                     subscriberId:
 *                       type: string
 *                       example: cmk5ngrfv0002id2cqdvmpxv7
 *                     planName:
 *                       type: string
 *                       example: Premium Plan
 *                     amount:
 *                       type: number
 *                       example: 90000
 *                     billingInterval:
 *                       type: string
 *                       example: monthly
 *                     billingCycleCount:
 *                       type: number
 *                       example: 1
 *                     currency:
 *                       type: string
 *                       example: NGN
 *                     status:
 *                       type: string
 *                       example: pending
 *                 payment:
 *                   type: object
 *                   description: Paystack initialization response
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: Authorization URL created
 *                     data:
 *                       type: object
 *                       properties:
 *                         authorization_url:
 *                           type: string
 *                           example: https://checkout.paystack.com/xxxxxx
 *                         reference:
 *                           type: string
 *                           example: sub_1700000000000_cmk5qvnjq000110ycg3ipsgj4
 *       400:
 *         description: Subscription or payment initialization failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Client already has an active subscription
 */
export const createSubscriptionController = async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.user?._id;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: user not found in request" });
    }
   
      const payload = {...req.body, userId: userId, email: userEmail};

  try {
    const subscription = await createSubscriptionService(payload);
    return res.status(201).json(subscription);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};



/**
 * @swagger
 * /subscriptions/verify-payment:
 *   get:
 *     summary: Verify subscription payment
 *     description: Verifies payment via Paystack and redirects to frontend with status.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - name: reference
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: sub_167832698846
 *         description: Paystack payment reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Webhook signature mismatch
 */
export const verifyPayment = async (req: Request, res: Response) => {
 
    await verifyPaymentService(req, res);
 
};


export const verifyPaymentTest = async (req: Request, res: Response) => {

    await verifyPaymentTestService(req, res);

};