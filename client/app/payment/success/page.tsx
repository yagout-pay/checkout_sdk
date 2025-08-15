// eslint-disable

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { PaymentContext } from "@/context/paymentInfoContext";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const PaymentSuccess = function () {
  const { state } = useContext(PaymentContext);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    if (!state?.done) {
      router?.push("/");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Green bubble particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      swing: number;
      currentSwing: number;
    }[] = [];
    const particleCount = 40; // Reduced quantity

    // Create initial particles at top
    for (let i = 0; i < particleCount; i++) {
      const hue = 100 + Math.random() * 30; // Green hue range
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -100, // Start above viewport
        size: Math.random() * 6 + 4, // Smaller size (4-10px)
        speed: Math.random() * 1.5 + 0.5, // Slower speed
        color: `hsla(${hue}, 80%, 50%, ${Math.random() * 0.3 + 0.4})`,
        swing: Math.random() * 0.1 - 0.05, // Reduced swing
        currentSwing: Math.random() * Math.PI * 2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speed; // Move downward
        p.x += Math.sin(p.currentSwing) * 1;
        p.currentSwing += p.swing;

        // Bubble with subtle highlight
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 1.1, 0, 0, Math.PI * 1.1);

        const gradient = ctx.createRadialGradient(
          p.x - p.size / 4,
          p.y - p.size / 4,
          p.size / 6,
          p.x,
          p.y,
          p.size
        );
        gradient.addColorStop(
          0,
          `hsla(${100 + Math.random() * 30}, 100%, 80%, 0.7)`
        );
        gradient.addColorStop(1, p.color);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Reset particles that go off bottom
        if (p.y > canvas.height + p.size * 2) {
          p.y = -p.size * 2;
          p.x = Math.random() * canvas.width;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state?.done, router]);

  if (!state?.done) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500/[.1] to-green-100/[.05] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Green bubbles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      />

      {/* Content */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl relative z-10 backdrop-blur-sm bg-opacity-90">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-bounce">
              <Sparkles className="h-16 w-16 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
          <p className="text-green-100 mt-2">Thank you for your purchase</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-600">
                {timestamp || "Today"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Order Number</span>
              <span className="font-medium text-gray-600">
                #{state.order_no || "0001"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium text-green-600">
                ${state.amount?.toFixed(2) || 100}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-600">
                {state.cust_name || "Klaus Mikaelson"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-600">
                {state.email || "Klaus@email.com"}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Back to Home
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
