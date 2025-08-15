"use client";

import { CheckoutContext } from "@/context/checkoutContext";
import { PaymentContext } from "@/context/paymentInfoContext";
import React, { useContext, useEffect } from "react";

const Hero = function () {
  const { dispatch: checkoutDispact } = useContext(CheckoutContext);
  const { dispatch } = useContext(PaymentContext);

  useEffect(() => {
    checkoutDispact({
      type: "RESET",
    });
    dispatch({
      type: "RESET_PAYMENT",
    });
  }, [checkoutDispact, dispatch]);
  return (
    <section className="w-full h-[40%] min-h-[400px] sm:min-h-[300px] relative bg-gradient-to-br from-background via-primary/5 to-muted/30 overflow-hidden">
      {/* Dynamic grid overlay */}
      <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] dark:bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]"></div>
      </div>

      <div className="container h-full flex flex-col justify-center px-4 sm:px-6 text-center">
        {/* Main title with gradient */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground mb-3 sm:mb-4">
          Yagout Payment Gateway
        </h1>

        {/* Description with emphasized keywords */}
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6">
          Integrate Ethiopian payments like{" "}
          <span className="font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded">
            telebirr
          </span>
          ,{" "}
          <span className="font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded">
            CBE Birr
          </span>{" "}
          and more with our powerful API
        </p>

        {/* Mobile-optimized contact card */}
        <div className="bg-muted/50 backdrop-blur-sm border border-muted rounded-xl p-4 sm:p-6 max-w-md mx-auto w-full shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-xs sm:text-sm font-medium mb-1">
                💬 Need help?
              </p>
              <p className="text-xs text-muted-foreground">
                Contact our support team
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:0903195403"
                className="text-xs sm:text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-lg flex items-center gap-1 hover:bg-primary/20 transition-colors"
              >
                <span className="hidden sm:inline">📞</span> Call
              </a>
              <a
                href="https://t.me/hello_world1_1_1"
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-lg flex items-center gap-1 hover:bg-primary/20 transition-colors"
              >
                <span className="hidden sm:inline">💬</span> Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Demo notice - fixed at bottom on mobile */}
        <div className="mt-4 sm:mt-6 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full inline-flex items-center justify-center">
          <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Demo environment - No real transactions
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
