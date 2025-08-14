"use client";

import React, { useContext, useState, useEffect } from "react";
import { PaymentContext } from "@/context/paymentInfoContext";
import { Button } from "../ui/button";
import { CheckoutContext } from "@/context/checkoutContext";

export interface PaymentDetailsFormProps {
  productName: string;
}

const PaymentDetailsForm = ({ productName }: PaymentDetailsFormProps) => {
  const { dispatch: paymentDispatch, state: paymentState } = useContext(PaymentContext);
  const { dispatch: checkoutDispatch } = useContext(CheckoutContext);

  const [phone, setPhone] = useState(paymentState.mobile || "");
  const [isValid, setIsValid] = useState(false);

  const price = paymentState.amount || "0.00";
  const product = productName;

  useEffect(() => {
    const phoneRegex = /^(09|03)\d{8}$/;
    setIsValid(phoneRegex.test(phone));
  }, [phone]);

  const handleNext = () => {
    if (!isValid) return;
    paymentDispatch({ type: "SET_PHONE", payload: phone });
    checkoutDispatch({ type: "SET_STEP", payload: 2 });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Enter your details to continue</p>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">You're purchasing</h2>
          <div className="flex justify-between items-center border-b pb-4">
            <span className="font-medium">{product}</span>
            <span className="text-lg font-bold">{price} ETB</span>
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="09XXXXXXXX or 03XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 rounded-md border focus:outline-none focus:ring-1 transition-all ${
                phone && !isValid
                  ? "border-destructive focus:ring-destructive"
                  : "focus:ring-primary"
              }`}
            />
            {!isValid && phone && (
              <p className="text-sm text-destructive">
                Please enter a valid Ethiopian phone number
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Next Button - Fixed at bottom right */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="min-w-[120px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetailsForm;
