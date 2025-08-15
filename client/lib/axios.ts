/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/paymentApi.ts
import axios from "axios";

export interface PaymentRequest {
  order_no: number | null;
  amount: number | null;
  cust_name: string;
  email: string;
  mobile: string | null;
  success_url: string;
  failure_url: string;
}

export interface PaymentResponse {
  success_url: any;
  failure_url: any;
  // Adjust fields based on what your backend returns
  me_id: string;
  merchant_request: string;
  hash: string;
  post_url: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const processPayment = async (
  payload: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const response = await api.post<PaymentResponse>(
      "/prepare-payment",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Payment preparation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
