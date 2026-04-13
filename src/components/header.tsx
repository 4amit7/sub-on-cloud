"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/hooks";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Contact", href: "#footer" }
];

export function Header() {
  const { settings, loading } = useSettings();

  const whatsappUrl = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp}` 
    : "https://wa.me/919999999999";

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo - Dynamic from Settings */}
          {settings?.logo && !loading ? (
            <div className="relative h-11 w-11 flex-shrink-0">
              <Image
                src={settings.logo}
                alt="Logo"
                fill
                className="rounded-2xl object-cover shadow-lg shadow-red-200"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E60000] text-lg font-bold text-white shadow-lg shadow-red-200">
              SC
            </div>
          )}

          <div>
            <p className="text-base font-semibold uppercase tracking-[0.25em] text-black">
              Sub On Cloud
            </p>
            <p className="text-xs text-black/60">
              {settings?.openingHours ? settings.openingHours : "Fresh kitchen, fast delivery"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-black/70 hover:text-[#E60000]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* WhatsApp Button - Dynamic from Settings */}
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200"></div>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#E60000] transition"
          >
            WhatsApp
          </a>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-3 overflow-x-auto px-6 pb-4 md:hidden lg:px-10">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 hover:border-[#FFC107] hover:text-[#E60000]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
