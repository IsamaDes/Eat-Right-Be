import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import axios from "axios";

const prisma = new PrismaClient();

import { initializePaystackTransaction } from "../utils/paystack";
import crypto from "crypto";

export const createSubscriptionService = async (payload: any) => {
  const {
    subscriberId,
    plan_name,
    amount,
    billing_interval,
    billing_cycle_count,
    currency,
    metadata,
  } = payload;

  const subscription = await prisma.subscription.create({
    data: {
      subscriberId: subscriberId,
      planName: plan_name,
      amount,
      billingInterval: billing_interval,
      billingCycleCount: billing_cycle_count,
      currency: currency || "NGN",
      metadata,
      status: "pending",
    },
  });

  return subscription;
};

export const initializeSubscriptionPaymentService = async (
  subscriptionId: string,
  paymentPayload: any
) => {
    
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const reference = paymentPayload.reference || `sub_${Date.now()}`;

  const updateSubscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { reference },
  });

  if(!updateSubscription){
    throw new Error("Subscription update failed")
  }

  try {
    const payment = await initializePaystackTransaction({
    amount: subscription.amount * 100, 
    email: paymentPayload.email,
    reference,
    currency: subscription.currency,
    callback_url: paymentPayload.redirect_url,
    metadata: {
      subscriptionId,
      auto_renew: paymentPayload.metadata?.auto_renew,
    },
  }); 
  console.log(payment)
   return payment;
  } catch (error: any) {
    console.error("Payment initiation failed")
    throw new Error("Payment Initialization Failed")
  }
};

//  const verifyPaystackWebhook = async (req: any) => {
//   const secret = process.env.PAYSTACK_SECRET_KEY!;
//   const hash = crypto
//     .createHmac("sha512", secret)
//     .update(req.body)
//     .digest("hex");

//   if (hash !== req.headers["x-paystack-signature"]) {
//     throw new Error("Invalid webhook signature");
//   }

//   const event = JSON.parse(req.body.toString());

//   if (event.event === "charge.success") {
//     const reference = event.data.reference;

//     await prisma.subscription.update({
//       where: { reference },
//       data: { status: "active" },
//     });
//      return res.redirect("http://localhost:5173/client/profile");
//   }
// };



export const verifyPaymentService = async (req: Request, res: Response) => {
  try {
    const reference = (req.query as { reference?: string }).reference;
    const FRONTEND_URL = "https://eat-right-fe.vercel.app";

    if (!reference) {
      res.setHeader("ngrok-skip-browser-warning", "true");
      return res.redirect(`${FRONTEND_URL}/client/subscribe?error=missing_ref`);
    }

    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = verifyResponse.data.data;

    if (data.status === "success") {
      await prisma.subscription.update({
        where: { reference },
        data: { status: "active" },
      });

       res.setHeader("ngrok-skip-browser-warning", "true");

      return res.redirect(`${FRONTEND_URL}/client/profile`);

    }

    res.setHeader("ngrok-skip-browser-warning", "true");
    return res.redirect(`${FRONTEND_URL}/client/subscribe?failed=true`);
  } catch (error) {
    const FRONTEND_URL = "https://eat-right-fe.vercel.app";

    res.setHeader("ngrok-skip-browser-warning", "true");
    return res.redirect(`${FRONTEND_URL}/client/subscribe?failed=true`);
  }
};