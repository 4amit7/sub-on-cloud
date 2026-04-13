"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { SettingsManager } from "@/components/settings-manager";
import { ContentManager } from "@/components/content-manager";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"menu" | "settings" | "content">("menu");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Admin logout failed:", error);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8e6_0%,#ffffff_42%,#fff4d0_100%)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E60000]">
            Admin Console
          </p>
          <h1 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            Management Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:border-[#FFC107] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:border-[#FFC107]"
          >
            Back Home
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "menu"
                ? "border-b-2 border-[#E60000] text-[#E60000]"
                : "text-gray-600 hover:text-black"
            }`}
          >
            📋 Menu Management
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "settings"
                ? "border-b-2 border-[#E60000] text-[#E60000]"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === "content"
                ? "border-b-2 border-[#E60000] text-[#E60000]"
                : "text-gray-600 hover:text-black"
            }`}
          >
            📝 Content Management
          </button>
          <Link
            href="/admin/orders"
            className="px-6 py-4 font-semibold text-gray-600 hover:text-black transition"
          >
            📦 Orders
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {activeTab === "menu" && <AdminPanel />}
        {activeTab === "settings" && <SettingsManager />}
        {activeTab === "content" && <ContentManager />}
      </div>
    </main>
  );
}
