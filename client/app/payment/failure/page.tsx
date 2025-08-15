"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

const PaymentFailure = function () {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-bg-red-500/[.1] to-bg-red-600/[.05] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Error Header */}
        <div className="bg-red-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-red-600 mb-2 font-medium">
              We couldn&apos;t process your payment
            </p>
            <p className="text-gray-600 text-sm">
              Please check your payment details and try again.
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
