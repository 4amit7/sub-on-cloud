"use client";

import { useState } from "react";
import { useSettings } from "@/hooks";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutProps = {
  cartItems: CartItem[];
  total: number;
};

export function Checkout({ cartItems, total }: CheckoutProps) {
  const { settings } = useSettings();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        totalAmount: total,
        customerName,
        phone,
        address,
        paymentStatus: "pending" as const
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Redirect to UPI payment
      const upiUrl = `upi://pay?pa=7984691649@ptsbi&pn=SubOnCloud&am=${total}&cu=INR`;
      window.location.href = upiUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow">
      <h2 className="text-2xl font-bold text-black">Checkout</h2>

      {/* Cart Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">Your Order</h3>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Customer Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black">Delivery Details</h3>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
              placeholder="Enter your delivery address"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#E60000] px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Processing..." : "Pay with UPI"}
        </button>

        <p className="text-center text-xs text-gray-500">
          After payment, please send payment screenshot on WhatsApp to{" "}
          <a
            href={`https://wa.me/${settings?.whatsapp || "919999999999"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E60000] hover:underline"
          >
            {settings?.whatsapp || "+91 99999 99999"}
          </a>{" "}
          to confirm your order.
        </p>
      </form>
    </div>
  );
}