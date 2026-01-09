import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CreateSubscriptionInput } from "../types/payment";
import { initializePaystackTransaction, PaymentErrorCode } from "../utils/paystack";
import axios from "axios";

const prisma = new PrismaClient();

const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL!;

export const createSubscriptionService = async (input: CreateSubscriptionInput) => {
  const {
    userId,
    planName,
    amount,
    billingInterval,
    billingCycleCount,
    currency = "NGN",
    metadata,
    gateway,
    reference,
  } = input;

  console.log("=== Subscription Creation Started ===");
  console.log("Input:", JSON.stringify(input, null, 2));
 
  return prisma.$transaction(async (tx) => {
    console.log("Step 1: Finding client with userId:", userId);
   const client = await tx.clientProfile.findUnique({
    where: {userId},
    include: {
      user: true, 
      subscription: { 
        where: {
            status: "active" 
          }}}
   })

  if (!client) {
  console.error(" Client not found for userId:", userId);
  throw new Error("Client not found"); 
}

 console.log("Client found:", client.id);

   if (client.subscription?.length) {
    console.error("Client already has active subscription:", client.subscription);
    throw new Error("Client already has an active subscription");
  }

  console.log("No active subscription found");

  console.log("Step 3: Creating subscription...");
  const subscription = await tx.subscription.create({
    data: {
      subscriberId: client.id,
      clientEmail: client.user.email,
      planName,
      amount,
      billingInterval,
      billingCycleCount,
      currency: currency || "NGN",
      metadata,
      status: "pending",
    },
  });
  console.log("Subscription created:", subscription.id);
  
const paymentReference = reference ?? `sub_${Date.now()}_${subscription.id}`;
console.log(" Payment reference:", paymentReference);
if (gateway !== "paystack") {
  console.error(" Unsupported gateway:", gateway);
  throw new Error("Unsupported payment gateway");
}
 console.log("Gateway validated:", gateway);

 console.log("Step 6: Initializing Paystack payment...");
 
  try {
    const payment = await initializePaystackTransaction({
    email: client.user.email,
    amount: subscription.amount * 100, 
    reference: paymentReference,
    currency: subscription.currency,
    callbackUrl: PAYSTACK_CALLBACK_URL,
    metadata: {
      subscriptionId: subscription.id,
      autoRenew: input.metadata?.autoRenew,
    },
  });
 
  console.log("Paystack response:", JSON.stringify(payment, null, 2)) 

   await tx.subscription.update({
        where: { id: subscription.id },
        data: { reference: paymentReference }
      });

      console.log("Subscription updated with reference");
   return {
    subscription, 
    payment
  };
  } catch (error: any) {
     console.error("Payment initiation failed");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        if (error.response) {
        console.error("Paystack API Response Error:");
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
        console.error("Headers:", error.response.headers);
      }
     await tx.subscription.delete({
        where: { id: subscription.id }
      });
      console.log(" Subscription deleted due to payment failure");
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        throw new Error(`Payment Initialization Failed: ${errorMessage}`);
  }
});
}


export const verifyPaymentService = async (req: Request, res: Response) => {
  const FRONTEND_URL = "https://eat-right-fe.vercel.app";

  try {
    const reference = (req.query as { reference?: string }).reference;

     if (!reference) {
      return res.redirect(
        `${FRONTEND_URL}/client/subscription?error=${PaymentErrorCode.MISSING_REFERENCE}`
      );
    }

    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = verifyResponse.data?.data;

    if (!paystackData) {
      return res.redirect(
        `${FRONTEND_URL}/client/subscription?error=${PaymentErrorCode.VERIFICATION_FAILED}`
      );
    }

      if (paystackData.status !== "success") {
      return res.redirect(
        `${FRONTEND_URL}/client/subscription?error=${PaymentErrorCode.TRANSACTION_NOT_SUCCESSFUL}`
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { reference },
       include: {
        clientProfile: {
          include: {
            user: true
          }
        }
      }
    });

    if (!subscription) {
      return res.redirect(
        `${FRONTEND_URL}/client/subscription?error=${PaymentErrorCode.SUBSCRIPTION_NOT_FOUND}`
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (subscription.billingInterval) {
      case "daily":
        endDate.setDate(endDate.getDate() + subscription.billingCycleCount);
        break;

      case "weekly":
        endDate.setDate(endDate.getDate() + subscription.billingCycleCount * 7);
        break;

      case "monthly":
        endDate.setMonth(endDate.getMonth() + subscription.billingCycleCount);
        break;

      case "quarterly":
        endDate.setMonth(endDate.getMonth() + subscription.billingCycleCount * 3);
        break;

      case "yearly":
        endDate.setFullYear(
          endDate.getFullYear() + subscription.billingCycleCount
        );
        break;

      default:
        throw new Error("Invalid billing interval");
    }

    await prisma.subscription.update({
      where: { reference },
      data: {
        status: "active",
        startDate,
        endDate,
      },
    });

    return res.redirect(`${FRONTEND_URL}/client/profile`);
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.redirect(
       `${FRONTEND_URL}/client/subscription?error=${PaymentErrorCode.INTERNAL_ERROR}`
    );
  }
};









//..................................................................










//for testing
export const verifyPaymentTestService = async (req: Request, res: Response) => {
  try {
    const reference = (req.query as { reference?: string }).reference;

    console.log("=== Payment Verification Test Started (JSON Mode) ===");
    console.log("Reference:", reference);

    if (!reference) {
      console.error("Missing reference parameter");
      return res.status(400).json({
        success: false,
        error: "Missing reference parameter",
        hint: "Add ?reference=your_reference to the URL"
      });
    }

    console.log("Step 1: Verifying payment with Paystack API...");
    let verifyResponse;
    try {
      verifyResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );
    } catch (error: any) {
      console.error(" Paystack API error:", error.response?.data);
      return res.status(400).json({
        success: false,
        error: "Failed to verify payment with Paystack",
        paystackError: error.response?.data || error.message
      });
    }

    const paystackData = verifyResponse.data?.data;
    console.log("Paystack response status:", paystackData?.status);

    if (!paystackData || paystackData.status !== "success") {
      console.error("Payment status is not 'success':", paystackData?.status);
      return res.status(400).json({
        success: false,
        error: "Payment was not successful",
        paystackStatus: paystackData?.status,
        paystackMessage: verifyResponse.data?.message,
        paystackData: paystackData
      });
    }

    console.log("Payment verified successfully with Paystack");
    console.log("Amount paid:", paystackData.amount / 100, paystackData.currency);

    console.log("Step 2: Finding subscription in database...");
    const subscription = await prisma.subscription.findUnique({
      where: { reference },
      include: {
        clientProfile: {
          include: {
            user: true
          }
        }
      }
    });

    if (!subscription) {
      console.error(" Subscription not found for reference:", reference);
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
        reference: reference,
        hint: "This reference does not match any subscription in the database"
      });
    }

    console.log(" Subscription found:", subscription.id);
    console.log("Current status:", subscription.status);

    if (subscription.status === "active") {
      console.log("Subscription already active");
      return res.status(200).json({
        success: true,
        message: "Subscription was already activated",
        alreadyActive: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          planName: subscription.planName,
          amount: subscription.amount,
          billingInterval: subscription.billingInterval
        },
        paystackData: {
          status: paystackData.status,
          amount: paystackData.amount,
          paidAt: paystackData.paid_at,
          customer: paystackData.customer
        }
        
      });
    }

    // Step 4: Calculate subscription period
    console.log("Step 3: Calculating subscription period...");
    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (subscription.billingInterval.toLowerCase()) {
      case "daily":
        endDate.setDate(endDate.getDate() + subscription.billingCycleCount);
        break;
      case "weekly":
        endDate.setDate(endDate.getDate() + subscription.billingCycleCount * 7);
        break;
      case "monthly":
        endDate.setMonth(endDate.getMonth() + subscription.billingCycleCount);
        break;
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + subscription.billingCycleCount * 3);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + subscription.billingCycleCount);
        break;
      default:
        console.error("Invalid billing interval:", subscription.billingInterval);
        return res.status(400).json({
          success: false,
          error: "Invalid billing interval",
          billingInterval: subscription.billingInterval
        });
    }

    console.log("Subscription period:");
    console.log("  Start:", startDate.toISOString());
    console.log("  End:", endDate.toISOString());

    console.log("Step 4: Activating subscription...");
    const updatedSubscription = await prisma.subscription.update({
      where: { reference },
      data: {
        status: "active",
        startDate: startDate,
        endDate: endDate,
      },
    });

    console.log("Subscription activated successfully");
    console.log("=== Payment Verification Test Completed ===");

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      subscription: {
        id: updatedSubscription.id,
        subscriberId: updatedSubscription.subscriberId,
        clientEmail: updatedSubscription.clientEmail,
        planName: updatedSubscription.planName,
        amount: updatedSubscription.amount,
        currency: updatedSubscription.currency,
        billingInterval: updatedSubscription.billingInterval,
        billingCycleCount: updatedSubscription.billingCycleCount,
        status: updatedSubscription.status,
        startDate: updatedSubscription.startDate,
        endDate: updatedSubscription.endDate,
        reference: updatedSubscription.reference,
        metadata: updatedSubscription.metadata
      },
      payment: {
        status: paystackData.status,
        amount: paystackData.amount / 100, 
        currency: paystackData.currency,
        paidAt: paystackData.paid_at,
        channel: paystackData.channel,
        customer: {
          email: paystackData.customer?.email,
          customerCode: paystackData.customer?.customer_code
        }
      }
    });
    
  } catch (error: any) {
    console.error("Payment verification test error:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }

    return res.status(500).json({
      success: false,
      error: "Payment verification failed",
      message: error.message,
      details: error.response?.data || null
    });
  }
};

