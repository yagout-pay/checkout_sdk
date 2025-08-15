"use client";

import React, { useContext, useEffect } from "react";
import { CheckoutContext } from "@/context/checkoutContext";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "next/navigation";
import { Product } from "@/constants/data";
import { PaymentContext } from "@/context/paymentInfoContext";

// Step components
import CheckoutStep1 from "./checkout-step-1";
import PaymentMethodSelection from "./checkout-step-2";
import PaymentConfirmation from "./checkout-step-3";

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Method" },
  { id: 3, label: "Confirm" },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const data: Product = {
    id: Number(searchParams.get("id"))!,
    productName: searchParams.get("name")!,
    productPrice: Number(searchParams.get("price"))!,
  };
  const { dispatch } = useContext(PaymentContext);
  const { state } = useContext(CheckoutContext);
  const step = state?.currentStep || 1;

  useEffect(() => {
    dispatch({
      type: "SET_PRICE_AND_ORDER",
      payload: { order_no: data?.id, amount: data?.productPrice },
    });
  }, [data?.id, data?.productPrice, dispatch]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CheckoutStep1 productName={data?.productName} />;
      case 2:
        return <PaymentMethodSelection />;
      case 3:
        return <PaymentConfirmation productName={data?.productName} />;
      default:
        return <CheckoutStep1 productName={data?.productName} />;
    }
  };

  return (
    <div className="w-full h-[93%] flex flex-col">
      {/* Header */}
      <div className="w-full px-6 pt-6 pb-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
          Secure Checkout
        </h2>
        <p className="text-muted-foreground">
          Complete your payment in just a few steps
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row px-6 gap-6 pb-6 overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-[45%] 2xl:w-[40%] h-full flex flex-col gap-6">
          {/* Progress Indicator */}
          <div className="space-y-4">
            {/* Step Circles */}
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -z-10" />
              {steps.map((s, index) => (
                <div key={s.id} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-medium border-2 relative transition-colors
                      ${
                        step > index
                          ? "bg-primary border-primary text-white"
                          : step === s.id
                          ? "border-primary bg-background text-primary shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                          : "border-muted bg-background text-muted-foreground"
                      }`}
                  >
                    {step > index ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors ${
                      step >= s.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">
                  Step {step} of {steps.length}
                </span>
                <span className="text-primary">
                  {Math.round((step / steps.length) * 100)}% Complete
                </span>
              </div>
              <Progress
                value={(step / steps.length) * 100}
                className="h-2 bg-muted"
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 rounded-xl border bg-background p-6 shadow-sm overflow-y-auto">
            {renderStep()}
          </div>
        </div>

        <div className="hidden lg:flex flex-1  lg:w-[55%] 2xl:w-[60%] h-full rounded-xl border overflow-hidden shadow-sm relative">
          <Image
            src="/pay5.jpg"
            alt="Secure payment illustration"
            className="w-full h-full object-cover"
            width={800}
            height={800}
            priority
          />

          {/* Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t-r from-black/[.7] via-black/[.6] to-black z-100" /> */}
          <div className="absolute inset-0 bg-gradient-to-tr from-bg-black/[.03] via-black/[.05] dark:from-black/[.5] dark:via-black/[.2] to-primary/[.6]  z-100" />

          {/* Text Overlay */}
          <div className="absolute bottom-0 p-8 text-white z-1000 max-w-md">
            <h2 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg leading-tight">
              Fast, Secure & Hassle-Free Payments
            </h2>
            <p className="mt-3 text-lg text-white/80 drop-shadow">
              Complete your purchase in just a few clicks with our fully
              encrypted and reliable system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
