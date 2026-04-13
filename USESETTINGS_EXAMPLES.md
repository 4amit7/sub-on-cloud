# useSettings Hook - Usage Examples

## Overview
`useSettings` is a reusable React hook that fetches global settings from `/api/settings` and provides loading/error states.

## Basic Usage

```tsx
"use client";

import { useSettings } from "@/hooks";

export function MyComponent() {
  const { settings, loading, error } = useSettings();

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return null;

  return (
    <div>
      <h2>Contact: {settings.phone}</h2>
      <p>{settings.address}</p>
    </div>
  );
}
```

---

## Example 1: Header with Settings

```tsx
"use client";

import { useSettings } from "@/hooks";

export function Header() {
  const { settings, loading } = useSettings();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        {settings?.logo && !loading && (
          <img src={settings.logo} alt="Logo" className="h-10" />
        )}

        {/* Contact Info */}
        {settings && (
          <div className="text-sm text-gray-600">
            📞 {settings.phone} • 🕒 {settings.openingHours}
          </div>
        )}
      </div>
    </header>
  );
}
```

---

## Example 2: Footer with Social Links

```tsx
"use client";

import { useSettings } from "@/hooks";

export function Footer() {
  const { settings, loading, error } = useSettings();

  if (loading || error || !settings) return null;

  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Address & Hours */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Visit Us</h3>
          <p>{settings.address}</p>
          <p>🕒 {settings.openingHours}</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 border-t pt-4">
          {settings.instagram && (
            <a href={settings.instagram} target="_blank" className="hover:text-blue-400">
              📸 Instagram
            </a>
          )}
          {settings.facebook && (
            <a href={settings.facebook} target="_blank" className="hover:text-blue-400">
              👥 Facebook
            </a>
          )}
          {settings.twitter && (
            <a href={settings.twitter} target="_blank" className="hover:text-blue-400">
              𝕏 Twitter
            </a>
          )}
          {settings.zomato && (
            <a href={settings.zomato} target="_blank" className="hover:text-blue-400">
              🍽️ Zomato
            </a>
          )}
        </div>

        {/* Contact */}
        <div className="mt-6 text-sm text-gray-400 border-t pt-4">
          <p>📞 {settings.phone}</p>
          <p>💬 WhatsApp: {settings.whatsapp}</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## Example 3: Contact Card

```tsx
"use client";

import { useSettings } from "@/hooks";

export function ContactCard() {
  const { settings, loading, error, refetch } = useSettings();

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Contact Info</h2>
        <button
          onClick={refetch}
          disabled={loading}
          className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : settings ? (
        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Phone:</span> {settings.phone}
          </p>
          <p>
            <span className="font-semibold">WhatsApp:</span> {settings.whatsapp}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {settings.address}
          </p>
          <p>
            <span className="font-semibold">Hours:</span> {settings.openingHours}
          </p>
        </div>
      ) : null}
    </div>
  );
}
```

---

## Example 4: Dynamic Meta Tags

```tsx
"use client";

import { useSettings } from "@/hooks";
import { useEffect } from "react";

export function DynamicMetaTags() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // Update page title with phone
    document.title = `Contact: ${settings.phone} - Sub On Cloud`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `Contact us at ${settings.phone}. ${settings.address}. Open ${settings.openingHours}`
      );
    }
  }, [settings]);

  return null;
}
```

---

## Example 5: WhatsApp Contact Button

```tsx
"use client";

import { useSettings } from "@/hooks";

export function WhatsAppButton() {
  const { settings, loading } = useSettings();

  if (loading || !settings) return null;

  const handleWhatsApp = () => {
    const message = "Hi! I would like to place an order.";
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
      💬 Chat on WhatsApp
    </button>
  );
}
```

---

## Example 6: Settings Context (Optional)

If you want to use settings across your entire app without fetching in every component:

```tsx
"use client";

import { createContext, useContext } from "react";
import { useSettings } from "@/hooks";
import type { Settings } from "@/types/settings";

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { settings, loading, error } = useSettings();

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return context;
}
```

**Usage:**
```tsx
// In layout or root component
export default function RootLayout({ children }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}

// In any component
function MyComponent() {
  const { settings, loading } = useSettingsContext();
  return <div>{settings?.phone}</div>;
}
```

---

## Example 7: Conditional Rendering

```tsx
"use client";

import { useSettings } from "@/hooks";

export function SocialMediaLinks() {
  const { settings, loading, error } = useSettings();

  if (loading) return <div className="text-gray-400">Loading links...</div>;
  if (error) return null;
  if (!settings) return null;

  const links = [
    { name: "instagram", url: settings.instagram, icon: "📸" },
    { name: "facebook", url: settings.facebook, icon: "👥" },
    { name: "twitter", url: settings.twitter, icon: "𝕏" },
    { name: "zomato", url: settings.zomato, icon: "🍽️" }
  ].filter(link => link.url);

  return (
    <div className="flex gap-2">
      {links.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:opacity-75 transition"
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
```

---

## Hook API Reference

### Return Type
```typescript
interface UseSettingsReturn {
  settings: Settings | null;      // Current settings object
  loading: boolean;               // True while fetching
  error: string | null;          // Error message if fetch fails
  refetch: () => Promise<void>;  // Manually trigger refresh
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `settings` | `Settings \| null` | Fetched settings object, null while loading |
| `loading` | `boolean` | True during initial fetch or refetch |
| `error` | `string \| null` | Error message if fetch fails, null on success |
| `refetch` | `() => Promise<void>` | Function to manually trigger settings refresh |

---

## Best Practices

✅ **DO:**
- Use in client components (hook requires "use client")
- Handle loading state while fetching
- Show error messages to users
- Cache settings at application level if needed
- Use refetch to get fresh data when settings change

❌ **DON'T:**
- Use in server components (won't work)
- Ignore loading state (causes layout shift)
- Fetch on every render (use in top-level components)
- Create multiple instances unnecessarily (use context for app-wide access)

---

## Performance Optimization

### Option 1: Use at High Level
```tsx
// Fetch once at layout level
export default function Layout({ children }) {
  const { settings } = useSettings();
  
  return (
    <div>
      {/* Pass settings to children if needed */}
      {children}
    </div>
  );
}
```

### Option 2: Use Context (Recommended for large apps)
```tsx
// Fetch once in context provider
import { SettingsProvider } from "@/context/SettingsContext";

export default function Layout({ children }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}

// Use anywhere without additional fetches
function MyComponent() {
  const { settings } = useSettingsContext();
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hook not working in server component | Add "use client" at top of file |
| Always showing loading state | Check if /api/settings endpoint is working |
| Error message shows | Verify API is returning valid data |
| Slow to load | Consider using context provider at app level |

---

## Import Examples

```tsx
// Named import
import { useSettings } from "@/hooks";

// From index
import { useSettings } from "@/hooks/index";

// Direct import
import { useSettings } from "@/hooks/useSettings";
```
