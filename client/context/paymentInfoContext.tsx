"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";

export interface PaymentData {
  order_no: number | null;
  amount: number | null;
  cust_name: string;
  email: string;
  mobile: string | null;
  success_url: string;
  failure_url: string;
}

export type PaymentAction =
  | { type: "SET_PHONE"; payload: string }
  | { type: "RESET_PHONE" }
  | {
      type: "SET_PRICE_AND_ORDER";
      payload: { amount: number; order_no: number };
    }
  | { type: "RESET_PAYMENT" };

const initialPayment: PaymentData = {
  order_no: null,
  amount: null,
  cust_name: "John Doe",
  email: "john@example.com",
  mobile: null,
  success_url: "http://localhost:8080/success",
  failure_url: "http://localhost:8080/failure",
};

const localStorageKey = "paymentData";

function loadState(): PaymentData {
  if (typeof window === "undefined") return initialPayment;
  try {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? JSON.parse(saved) : initialPayment;
  } catch {
    return initialPayment;
  }
}

function reducer(state: PaymentData, action: PaymentAction): PaymentData {
  switch (action.type) {
    case "SET_PHONE":
      return { ...state, mobile: action.payload };
    case "RESET_PHONE":
      return { ...state, mobile: null };
    case "SET_PRICE_AND_ORDER":
      return {
        ...state,
        amount: action.payload.amount,
        order_no: action.payload.order_no,
      };
    case "RESET_PAYMENT":
      return initialPayment;
    default:
      return state;
  }
}

export const PaymentContext = createContext<{
  state: PaymentData;
  dispatch: React.Dispatch<PaymentAction>;
}>({
  state: initialPayment,
  dispatch: () => null,
});

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialPayment, loadState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    }
  }, [state]);

  return (
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
}
