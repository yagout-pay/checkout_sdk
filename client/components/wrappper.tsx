"use client";
import { CheckoutProvider } from "@/context/checkoutContext";
import { PaymentProvider } from "@/context/paymentInfoContext";
import { useTheme } from "next-themes";

import React from "react";

const Wrapper = function ({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`w-full h-screen overflow-y-auto ${
        theme === "dark" && "dark"
      }`}
    >
      <CheckoutProvider>
        <PaymentProvider>{children}</PaymentProvider>
      </CheckoutProvider>
    </div>
  );
};

export default Wrapper;
