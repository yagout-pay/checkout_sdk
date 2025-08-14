import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Products from "@/components/home/products";
import React from "react";

export default function Home() {
  return (
    <div className="container  mx-auto size-full overflow-hidden">
        <Header />
        <Hero />
        <Products />
    </div>
  );
}
