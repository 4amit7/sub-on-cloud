"use client";

import { useSettings, useContent } from "@/hooks";

export function Footer() {
  const { settings, loading } = useSettings();
  const { content, loading: contentLoading } = useContent();

  const footerText =
    content?.footerText ||
    "Fresh healthy subs, wraps and quick bites made for modern delivery. Serving hungry customers across Vadodara.";

  return (
    <footer id="footer" className="border-t border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        {/* Brand & Description */}
        <div className="flex-1">
          <p className="text-lg font-bold uppercase tracking-[0.22em] text-black">
            Sub On Cloud
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-black/65">
            {footerText}
          </p>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-2 text-sm text-black/70">
          <p className="font-semibold uppercase tracking-wide text-black">Contact</p>
          
          {/* Phone */}
          {settings?.phone && !loading ? (
            <a href={`tel:+${settings.phone}`} className="hover:text-[#E60000] transition">
              📞 {settings.phone}
            </a>
          ) : (
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
          )}

          {/* Opening Hours */}
          {settings?.openingHours && !loading ? (
            <p className="text-black/70">
              🕒 {settings.openingHours}
            </p>
          ) : (
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
          )}

          {/* Address */}
          {settings?.address && !loading ? (
            <p className="text-black/70">
              📍 {settings.address}
            </p>
          ) : (
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold uppercase tracking-wide text-black">Follow Us</p>
          <div className="flex gap-3">
            {/* Instagram */}
            {settings?.instagram && !loading && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-lg hover:bg-[#E60000] hover:text-white transition"
                title="Instagram"
              >
                📸
              </a>
            )}

            {/* Facebook */}
            {settings?.facebook && !loading && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-lg hover:bg-[#E60000] hover:text-white transition"
                title="Facebook"
              >
                👥
              </a>
            )}

            {/* Twitter */}
            {settings?.twitter && !loading && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-lg hover:bg-[#E60000] hover:text-white transition"
                title="Twitter"
              >
                𝕏
              </a>
            )}

            {/* Show placeholder if no social links */}
            {!settings?.instagram &&
              !settings?.facebook &&
              !settings?.twitter &&
              !loading && (
                <p className="text-sm text-gray-400">No social links available</p>
              )}

            {/* Loading state */}
            {loading && (
              <div className="flex gap-2">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-black/5 px-6 py-4 text-center text-xs text-black/50 lg:px-10">
        <p>&copy; {new Date().getFullYear()} Sub On Cloud. All rights reserved.</p>
      </div>
    </footer>
  );
}
