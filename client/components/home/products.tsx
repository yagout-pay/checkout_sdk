import React from "react";
import { products } from "@/constants/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductSelection = () => {
  return (
    <div className="size-full flex flex-col border rounded-lg p-4">
      {/* Header */}
      <div className="w-full h-[10%] space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Available Products
        </h2>
        <p className="text-muted-foreground">
          Select a product to begin payment process
        </p>
      </div>

      {/* Table */}
      <div className="w-full h-[90%] border rounded-lg ">
        <ScrollArea className="size-full">
          <table className="w-full">
            <thead className="border-b">
              <tr className="bg-muted/50">
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  Product
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium">{product.id}</td>
                  <td className="p-4 text-sm">{product.productName}</td>
                  <td className="p-4 text-sm font-medium">
                    {product.productPrice.toLocaleString()} ETB
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/checkout?name=${encodeURIComponent(
                        product.productName
                      )}&id=${product.id}&price=${product.productPrice}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[80px]"
                      >
                        Select
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProductSelection;
