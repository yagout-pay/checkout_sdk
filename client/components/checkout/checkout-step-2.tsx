// eslint-disable
"use client";

import React, { useState, useContext } from "react";
import { CheckoutContext } from "@/context/checkoutContext";
import { Button } from "../ui/button";

const PaymentMethodSelection = () => {
  const { dispatch } = useContext(CheckoutContext);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedProvider) return;
    dispatch({ type: "SET_STEP", payload: 3 });
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Select Payment Method</h1>
          <p className="text-muted-foreground">
            Choose how you&apos;d like to pay
          </p>
        </div>

        {/* Payment Option */}
        <div className="space-y-4">
          <div
            onClick={() => setSelectedProvider("yagoutpay")}
            className={`p-6 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-4
              ${
                selectedProvider === "yagoutpay"
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground/30"
              }
            `}
          >
            <div
              className={`h-5 w-5 rounded-full border flex items-center justify-center
              ${
                selectedProvider === "yagoutpay"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}
            >
              {selectedProvider === "yagoutpay" && (
                <div className="h-2 w-2 rounded-full bg-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">YagoutPay</h3>
              <p className="text-sm text-muted-foreground">
                Secure digital payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedProvider}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
