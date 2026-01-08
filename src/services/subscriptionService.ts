import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CreateSubscriptionInput, InitializePaymentInput } from "../types/payment";
import { initializePaystackTransaction } from "../utils/paystack";


import axios from "axios";

const prisma = new PrismaClient();


export const createSubscriptionService = async (input: CreateSubscriptionInput) => {
  const {
    subscriberId,
    planName,
    amount,
    billingInterval,
    billingCycleCount,
    currency = "NGN",
    metadata,
  } = input;

  return prisma.$transaction(async (tx) => {
  const client = await tx.clientProfile.findUnique({
  where: { id: subscriberId },
  include: { user: true, subscription: true },
  }); 
  
  if (!client) {
  throw new Error("Client not found"); 
}

  if (client.subscription) {
    throw new Error("Client already has an active subscription");
  }


  const subscription = await tx.subscription.create({
    data: {
      subscriberId,
      planName,
      amount,
      billingInterval,
      billingCycleCount,
      currency: currency || "NGN",
      metadata,
      status: "pending",
    },
  });
  return subscription;
  });
};


export const initializeSubscriptionPaymentService = async (
  subscriptionId: string,
  input: InitializePaymentInput,
) => {
    
  const subscription = await prisma.$transaction(async (trx) => {
    const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!sub) {
    throw new Error("Subscription not found");
  }

  if (sub.status !== "pending") {
    throw new Error("Subscription is not payable");
  }

  const reference = input.reference || `sub_${Date.now()}`;

  const updateSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { reference },
  });

  if(!updateSub){
    throw new Error("Subscription update failed")
  }

  try {
    const payment = await initializePaystackTransaction({
    amount: subscription.amount * 100, 
    reference,
    currency: subscription.currency,
    callback_url: input.redirectUrl,
    metadata: {
      subscriptionId,
      auto_renew: input.metadata?.auto_renew,
    },
  }); 
  console.log(payment)
   return payment;
  } catch (error: any) {
    console.error("Payment initiation failed")
    throw new Error("Payment Initialization Failed")
  }
  })
};


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