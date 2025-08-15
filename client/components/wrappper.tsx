import { CheckoutProvider } from "@/context/checkoutContext";
import { PaymentProvider } from "@/context/paymentInfoContext";
import React from "react";

const Wrapper = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Top-left corner shadow (soft glow) */}
      <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/3 -translate-y-1/3 pointer-events-none z-10">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
        <div className="absolute inset-8 rounded-full bg-primary/3 blur-lg" />
      </div>

      {/* Bottom-right corner shadow (subtle accent) */}
      <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/3 pointer-events-none z-10">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
      </div>

      {/* Content area with perfect centering */}
      <CheckoutProvider>
        <PaymentProvider>
          <div className="w-full h-full overflow-auto relative z-20">
            {children}
          </div>
        </PaymentProvider>
      </CheckoutProvider>
    </div>
  );
};

export default Wrapper;
