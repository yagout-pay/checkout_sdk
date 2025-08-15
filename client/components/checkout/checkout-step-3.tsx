"use client";

import React, { useContext, useState } from "react";
import { PaymentContext } from "@/context/paymentInfoContext";
import { CheckoutContext } from "@/context/checkoutContext";
import { Button } from "../ui/button";
import { PaymentDetailsFormProps } from "./checkout-step-1";
import { processPayment } from "@/lib/axios";

const PaymentConfirmation = ({ productName }: PaymentDetailsFormProps) => {
  const { state: paymentState } = useContext(PaymentContext);
  const { dispatch: checkoutDispatch } = useContext(CheckoutContext);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    checkoutDispatch({ type: "SET_STEP", payload: 2 });
  };

  const handleProceed = async () => {
    setLoading(true);
    try {
      const paymentData = {
        ...paymentState,
        success_url: `${window.location.origin}/payment/success`,
        failure_url: `${window.location.origin}/payment/failure`,
        channel: "WEB",
        country: "ETH",
        currency: "ETB",
        txn_type: "SALE",
      };


      const req = await processPayment(paymentData);

      console.log("Payment Request:", req);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = req.post_url;
      form.enctype = "application/x-www-form-urlencoded";
      form.style.display = "none";

      const fields = {
        me_id: req.me_id,
        merchant_request: req.merchant_request,
        hash: req.hash,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Confirm Your Order</h1>
          <p className="text-muted-foreground">Review details before payment</p>
        </div>

        {/* Order Summary */}
        <div className="space-y-6 p-6 rounded-lg border">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{productName}</h2>
            <div className="h-px bg-muted"></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {paymentState.amount || "N/A"} ETB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order #</span>
              <span className="font-medium">
                {paymentState.order_no || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">
                {paymentState.cust_name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{paymentState.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">
                {paymentState.mobile || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold text-primary">YagoutPay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={handleBack} className="w-[48%]">
          Back
        </Button>
        <Button onClick={handleProceed} disabled={loading} className="w-[48%]">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Complete Payment"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
