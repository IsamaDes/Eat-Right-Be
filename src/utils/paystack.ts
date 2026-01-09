import axios from "axios";

const PAYSTACK_BASE = "https://api.paystack.co"; 
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const initializePaystackTransaction = async (payload: any) => {
  const response = await axios.post(`${PAYSTACK_BASE}/transaction/initialize`, payload, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};


export enum PaymentErrorCode {
  MISSING_REFERENCE = "PAY_001",
  VERIFICATION_FAILED = "PAY_002",
  TRANSACTION_NOT_SUCCESSFUL = "PAY_003",
  SUBSCRIPTION_NOT_FOUND = "PAY_004",
  INTERNAL_ERROR = "PAY_500",
}