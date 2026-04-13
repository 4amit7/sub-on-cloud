"use client";

/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/hooks";

type CartItem = {
  id?: string;
  name: string;
  price: number;
  qty?: number;
};

export default function CheckoutPage() {
  const { settings } = useSettings();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  useEffect(() => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(cartData);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll order status
  useEffect(() => {
    if (!orderId || !isPolling) return;

    const pollOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrderStatus(orderData.status);
          setPaymentStatus(orderData.paymentStatus);
          
          // Stop polling if payment is confirmed
          if (orderData.paymentStatus === "paid") {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error("Failed to poll order status:", error);
      }
    };

    // Poll immediately and then every 3 seconds
    pollOrderStatus();
    const interval = setInterval(pollOrderStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId, isPolling]);

  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handlePayment = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      let orderResponse;
      try {
        orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            totalAmount: total,
            customerName: name,
            phone,
            address,
            paymentStatus: "pending"
          })
        });
      } catch (fetchError) {
        console.error("Network error:", fetchError);
        alert("Unable to process order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Check if response is OK
      if (!orderResponse.ok) {
        console.error("API error response:", orderResponse.status);
        alert("Network issue. Please check internet and try again.");
        setIsProcessing(false);
        return;
      }

      let orderData;
      try {
        orderData = await orderResponse.json();
      } catch (parseError) {
        console.error("Response parse error:", parseError);
        alert("Network issue. Please check internet and try again.");
        setIsProcessing(false);
        return;
      }

      const newOrderId = orderData.id || orderData._id;
      setOrderId(newOrderId);
      setOrderStatus("pending");
      setIsPolling(true);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Unable to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    if (!orderId) return;

    // Generate UPI link
    const upiUrl = `upi://pay?pa=7984691649@ptsbi&pn=SubOnCloud&am=${total}&cu=INR`;

    // Open UPI
    window.location.href = upiUrl;

    // Mark payment as initiated
    setPaymentInitiated(true);
  };

  const handlePaymentCompleted = () => {
    // Generate WhatsApp message
    const itemsList = cart.map(item => `${item.name} (x${item.qty || 1}) - ₹${item.price * (item.qty || 1)}`).join("%0A");
    const whatsappMessage = `Order Placed!%0A%0AOrder ID: ${orderId}%0A%0AItems:%0A${itemsList}%0A%0ATotal: ₹${total}%0A%0ACustomer: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0APlease confirm receipt.`;
    const whatsappUrl = `https://wa.me/${settings?.whatsapp || "919999999999"}?text=${whatsappMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Clear cart
    localStorage.removeItem("cart");

    // Show success message
    alert("Thank you! Your order has been placed successfully. We'll start preparing your food.");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#E60000]"></div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-8">
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
          <p className="text-gray-600">Your cart is empty.</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-[#E60000] px-6 py-3 text-white font-semibold hover:bg-red-700"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  // Show success page when payment is confirmed
  if (paymentStatus === "paid") {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-black">Order Confirmed!</h1>
            <p className="mt-2 text-gray-600">Your payment has been received successfully.</p>
          </div>

          {/* Order Details */}
          <div className="text-left bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-black mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Order ID:</span> {orderId}</p>
              <p><span className="font-semibold">Customer:</span> {name}</p>
              <p><span className="font-semibold">Phone:</span> {phone}</p>
              <p><span className="font-semibold">Address:</span> {address}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-black mb-2">Items Ordered:</h3>
              <div className="space-y-1">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} × {item.qty || 1}</span>
                    <span>₹{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-black mt-2 pt-2 border-t border-gray-300">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>{"We'll start preparing your order shortly."}</p>
            <p>{"You'll receive updates on WhatsApp."}</p>
          </div>

          <Link
            href="/"
            className="inline-block rounded-lg bg-[#E60000] px-6 py-3 text-white font-semibold hover:bg-red-700"
          >
            Order More Food
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
          <p className="mt-2 text-gray-600">
            {orderStatus === null 
              ? "Review your order and complete payment"
              : orderStatus === "pending" 
                ? "Order placed successfully"
                : orderStatus === "approved"
                  ? "Order approved - ready for payment"
                  : "Order status update"
            }
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 border-t border-b py-6">
          <h2 className="text-lg font-bold text-black">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-black">
                  {item.name} × {item.qty || 1}
                </span>
                <span className="font-semibold text-black">₹{item.price * (item.qty || 1)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold text-black">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Order Status Messages */}
        {orderStatus === "pending" && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex items-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent mr-3"></div>
              <p className="text-yellow-800 font-medium">Waiting for kitchen confirmation...</p>
            </div>
            <p className="text-yellow-700 text-sm mt-1">Please wait while we confirm your order with the kitchen.</p>
          </div>
        )}

        {orderStatus === "approved" && !paymentInitiated && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-green-800 font-medium">✅ Order approved!</p>
            <p className="text-green-700 text-sm mt-1">Your order has been confirmed. Click below to proceed with payment.</p>
          </div>
        )}

        {orderStatus === "approved" && paymentInitiated && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-blue-800 font-medium">💳 Payment initiated</p>
            <p className="text-blue-700 text-sm mt-1">{'Complete your UPI payment, then click "I have completed payment" to confirm.'}</p>
          </div>
        )}

        {orderStatus === "rejected" && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-800 font-medium">❌ Order rejected</p>
            <p className="text-red-700 text-sm mt-1">{"We're sorry, but your order cannot be processed at this time. Please contact us for assistance."}</p>
          </div>
        )}

        {/* Delivery Form - only show if no order placed yet */}
        {orderStatus === null && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-black">Delivery Details</h2>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                placeholder="Enter your name"
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
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {orderStatus === null && (
            <>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 rounded-lg bg-[#E60000] px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
              <Link
                href="/"
                className="flex-1 rounded-lg border border-gray-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-gray-50"
              >
                Back to Menu
              </Link>
            </>
          )}

          {orderStatus === "approved" && !paymentInitiated && (
            <>
              <button
                onClick={handlePayNow}
                className="flex-1 rounded-lg bg-green-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Pay Now - ₹{total}
              </button>
              <Link
                href="/"
                className="flex-1 rounded-lg border border-gray-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-gray-50"
              >
                Cancel Order
              </Link>
            </>
          )}

          {orderStatus === "approved" && paymentInitiated && (
            <>
              <button
                onClick={handlePaymentCompleted}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                I have completed payment
              </button>
              <Link
                href="/"
                className="flex-1 rounded-lg border border-gray-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-gray-50"
              >
                Cancel Order
              </Link>
            </>
          )}

          {(orderStatus === "pending" || orderStatus === "rejected") && (
            <Link
              href="/"
              className="w-full rounded-lg border border-gray-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-gray-50 text-center"
            >
              Back to Menu
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
