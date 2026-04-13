/**
 * Example: Using Settings in Your Application
 * This file demonstrates how to fetch and use settings in different components
 */

// ============================================================================
// EXAMPLE 1: Fetching Settings in a Server Component
// ============================================================================

import { readSettingsFile } from "@/lib/settings-store";

export async function ServerComponentExample() {
  const settings = await readSettingsFile();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Logo */}
        {settings.logo && (
          <img 
            src={settings.logo} 
            alt="Logo" 
            className="h-12 mb-4"
          />
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold mb-2">Contact</h3>
            <p>📞 {settings.phone}</p>
            <p>💬 {settings.whatsapp}</p>
            <p>🕒 {settings.openingHours}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Visit Us</h3>
            <p>{settings.address}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 border-t pt-4">
          {settings.instagram && (
            <a href={settings.instagram} className="hover:text-blue-400">
              📸 Instagram
            </a>
          )}
          {settings.facebook && (
            <a href={settings.facebook} className="hover:text-blue-400">
              👥 Facebook
            </a>
          )}
          {settings.twitter && (
            <a href={settings.twitter} className="hover:text-blue-400">
              𝕏 Twitter
            </a>
          )}
          {settings.zomato && (
            <a href={settings.zomato} className="hover:text-blue-400">
              🍽️ Zomato
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// EXAMPLE 2: Fetching Settings in a Client Component
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import type { Settings } from "@/types/settings";

export function ClientComponentExample() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings", { 
          cache: "no-store" 
        });
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) return <div>Loading settings...</div>;
  if (!settings) return <div>Failed to load settings</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Info</h2>

      {/* Contact Card */}
      <div className="bg-white rounded-lg p-4 shadow">
        <p className="mb-2">
          <span className="font-semibold">Phone:</span> {settings.phone}
        </p>
        <p className="mb-2">
          <span className="font-semibold">WhatsApp:</span> {settings.whatsapp}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Hours:</span> {settings.openingHours}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {settings.address}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Using Settings in API Routes
// ============================================================================

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const settings = await readSettingsFile();

    // Use settings to configure something, e.g., email
    const emailConfig = {
      businessPhone: settings.phone,
      businessEmail: `info@${settings.address.split(",")[0].toLowerCase()}`,
      contactLinks: {
        whatsapp: settings.whatsapp,
        instagram: settings.instagram,
        facebook: settings.facebook,
        twitter: settings.twitter,
        zomato: settings.zomato
      }
    };

    return NextResponse.json(emailConfig);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

// ============================================================================
// EXAMPLE 4: Using Settings for SEO/Metadata
// ============================================================================

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await readSettingsFile();

  return {
    title: "Sub On Cloud",
    description: `Contact us at ${settings.phone} or ${settings.phone}. Open ${settings.openingHours}. Located in ${settings.address}`,
    openGraph: {
      images: [settings.logo],
      url: "https://subon.cloud",
      phoneNumbers: [settings.phone, settings.whatsapp],
    },
  };
}

// ============================================================================
// EXAMPLE 5: Building Social Links Menu
// ============================================================================

"use client";

import type { Settings } from "@/types/settings";

interface SocialLinksProps {
  settings: Settings;
  layout?: "horizontal" | "vertical";
}

export function SocialLinks({ settings, layout = "horizontal" }: SocialLinksProps) {
  const links = [
    {
      name: "instagram",
      label: "Instagram",
      icon: "📸",
      url: settings.instagram,
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: "👥",
      url: settings.facebook,
    },
    {
      name: "twitter",
      label: "Twitter",
      icon: "𝕏",
      url: settings.twitter,
    },
    {
      name: "zomato",
      label: "Zomato",
      icon: "🍽️",
      url: settings.zomato,
    },
  ].filter((link) => link.url);

  const containerClass =
    layout === "horizontal" ? "flex gap-4" : "flex flex-col gap-2";

  return (
    <div className={containerClass}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          title={link.label}
        >
          <span>{link.icon}</span>
          <span className="text-sm font-semibold">{link.label}</span>
        </a>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Contact Form Using Settings
// ============================================================================

"use client";

import { useState } from "react";
import type { Settings } from "@/types/settings";

export function ContactForm({ settings }: { settings: Settings }) {
  const [message, setMessage] = useState("");

  const handleWhatsAppClick = () => {
    // Format: https://wa.me/[countrycode][phonenumber]
    const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Get in Touch</h3>

      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={4}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="flex gap-2">
        <a
          href={`tel:${settings.phone}`}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-center"
        >
          📞 Call: {settings.phone}
        </a>
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          💬 WhatsApp
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-4 text-center">
        🕒 {settings.openingHours}
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Validation Before Updates
// ============================================================================

async function validateAndUpdateSettings(newSettings: Partial<Settings>) {
  /**
   * Validation example before updating
   * Add your custom validation logic here
   */

  const errors: string[] = [];

  if (newSettings.phone && newSettings.phone.length < 10) {
    errors.push("Phone number must be at least 10 digits");
  }

  if (newSettings.instagram && !newSettings.instagram.includes("instagram.com")) {
    errors.push("Invalid Instagram URL");
  }

  if (newSettings.whatsapp && newSettings.whatsapp.length < 10) {
    errors.push("WhatsApp number must be valid");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // Update using API
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSettings),
  });

  if (!response.ok) {
    return { success: false, errors: ["Failed to update settings"] };
  }

  return { success: true, data: await response.json() };
}

// ============================================================================
// EXAMPLE 8: Import Settings into Your Component
// ============================================================================

// Usage in a page or component:
export default async function HomePage() {
  const settings = await readSettingsFile();

  return (
    <div>
      {/* Header with logo */}
      <header className="flex items-center justify-between p-6">
        <img 
          src={settings.logo} 
          alt="Logo" 
          className="h-10"
        />
        <nav className="flex gap-4">
          {/* Use settings data in nav */}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Your page content */}
      </main>

      {/* Footer with settings */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="text-center">
          <p>📞 {settings.phone}</p>
          <p>🕒 {settings.openingHours}</p>
          <p>{settings.address}</p>
        </div>
      </footer>
    </div>
  );
}
