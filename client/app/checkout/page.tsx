"use client";

import CheckoutPage from "@/components/checkout/checkout";
import Header from "@/components/home/header";
import React from "react";

const Checkout = function () {
  return (
    <div className="size-full overflow-hidden container mx-auto">
      <Header />
      <CheckoutPage />
    </div>
  );
};

export default Checkout;
