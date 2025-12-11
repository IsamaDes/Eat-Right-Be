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
