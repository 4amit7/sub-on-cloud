"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  _id: string;
  items: any[];
  totalAmount: number;
  customerName: string;
  phone: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "pending" | "paid";
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getItemsSummary = (items: any[]) => {
    if (!items || items.length === 0) return "No items";
    const totalItems = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    const firstItem = items[0];
    const moreItems = items.length > 1 ? ` +${items.length - 1} more` : "";
    return `${firstItem.name} x${firstItem.qty || 1}${moreItems}`;
  };

  const updateOrder = async (
    orderId: string,
    data: {
      status?: "pending" | "approved" | "rejected";
      paymentStatus?: "pending" | "paid";
    }
  ) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...data })
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8e6_0%,#ffffff_42%,#fff4d0_100%)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#E60000]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8e6_0%,#ffffff_42%,#fff4d0_100%)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E60000]">
            Admin Console
          </p>
          <h1 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            Orders Management
          </h1>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:border-[#FFC107]"
        >
          Back to Admin
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-bold text-black">All Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Actions</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-black">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = order.status || "pending";
                    const paymentStatus = order.paymentStatus || "pending";
                    
                    return (
                    <tr key={order._id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-black">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm text-black">{getItemsSummary(order.items)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-black">₹{order.totalAmount}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {status === "pending" && (
                            <>
                              <button
                                onClick={() => updateOrder(order._id, { status: "approved" })}
                                className="rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateOrder(order._id, { status: "rejected" })}
                                className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {paymentStatus === "pending" && (
                            <button
                              onClick={() => updateOrder(order._id, { paymentStatus: "paid" })}
                              className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white hover:bg-green-600"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
