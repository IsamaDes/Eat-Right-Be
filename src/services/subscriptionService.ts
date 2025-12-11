import { PrismaClient } from "@prisma/client";

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

  const reference = `sub_${Date.now()}`;

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { reference },
  });

  const payment = await initializePaystackTransaction({
    amount: subscription.amount * 100, // Convert to Kobo
    email: paymentPayload.email || "customer@email.com",
    reference,
    currency: subscription.currency,
    callback_url: paymentPayload.redirect_url,
    metadata: {
      subscriptionId,
      auto_renew: paymentPayload.metadata?.auto_renew,
    },
  });

  return payment;
};

export const verifyPaystackWebhook = async (req: any) => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(req.body)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    throw new Error("Invalid webhook signature");
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    await prisma.subscription.update({
      where: { reference },
      data: { status: "active" },
    });
  }
};
