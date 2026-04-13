"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Settings } from "@/types/settings";

const initialSettings: Settings = {
  logo: "/images/logo.png",
  phone: "9999999999",
  whatsapp: "919999999999",
  address: "Manjalpur, Vadodara",
  email: "",
  instagram: "",
  facebook: "",
  twitter: "",
  zomato: "",
  swiggy: "",
  openingHours: "",
};

export function SettingsManager() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [form, setForm] = useState<Settings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [logoPreview, setLogoPreview] = useState<string>(initialSettings.logo);

  async function loadSettings() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      const data = (await response.json()) as Settings | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Unable to load settings");
      }

      setSettings(data);
      setForm(data);
      setLogoPreview(data.logo);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load settings"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleFieldChange(
    field: keyof Settings,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));

    if (field === "logo") {
      setLogoPreview(value);
    }
  }

  async function uploadLogoFile(file: File) {
    const uploadPayload = new FormData();
    uploadPayload.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadPayload
    });

    const data = (await response.json()) as { path?: string; error?: string };

    if (!response.ok || !data.path) {
      throw new Error(data.error || "Unable to upload logo.");
    }

    return data.path;
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);

    try {
      const uploadedPath = await uploadLogoFile(file);
      setForm((current) => ({
        ...current,
        logo: uploadedPath
      }));
      setLogoPreview(uploadedPath);
      setMessage("Logo uploaded successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Logo upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as Settings | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Failed to save settings");
      }

      setSettings(data);
      setMessage("✓ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save settings"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setForm(settings);
    setLogoPreview(settings.logo);
    setError("");
    setMessage("");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#E60000]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-lg bg-white p-8 shadow">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">Settings Management</h2>
        <p className="mt-2 text-gray-600">Manage your restaurant information and social links</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Logo Preview Section */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Logo Preview</h3>
            <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-h-40 max-w-40 object-contain"
                />
              ) : (
                <span className="text-gray-400">No logo</span>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Logo Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">
              Logo
            </label>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload logo file
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-[#E60000] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
              />
              {isUploading && (
                <p className="text-sm text-gray-500">Uploading logo…</p>
              )}
              <div className="text-xs text-gray-500">
                or enter URL:
              </div>
              <input
                type="text"
                placeholder="Enter logo URL"
                value={form.logo}
                onChange={(e) => handleFieldChange("logo", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-black">Contact Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="9999999999"
                  value={form.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="919999999999"
                  value={form.whatsapp}
                  onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Email
              </label>
              <input
                type="email"
                placeholder="hello@suboncloud.com"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Address
              </label>
              <textarea
                placeholder="Enter restaurant address"
                value={form.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                rows={3}
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Opening Hours
              </label>
              <input
                type="text"
                placeholder="11 AM - 11 PM"
                value={form.openingHours}
                onChange={(e) => handleFieldChange("openingHours", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-black">Social Media</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  📸 Instagram
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={form.instagram}
                  onChange={(e) => handleFieldChange("instagram", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  👥 Facebook
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={form.facebook}
                  onChange={(e) => handleFieldChange("facebook", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  𝕏 Twitter
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={form.twitter}
                  onChange={(e) => handleFieldChange("twitter", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  🍽️ Zomato
                </label>
                <input
                  type="url"
                  placeholder="https://zomato.com/..."
                  value={form.zomato}
                  onChange={(e) => handleFieldChange("zomato", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  🛵 Swiggy
                </label>
                <input
                  type="url"
                  placeholder="https://swiggy.com/..."
                  value={form.swiggy}
                  onChange={(e) => handleFieldChange("swiggy", e.target.value)}
                  className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-[#E60000] px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-black transition hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="border-t pt-8">
        <h3 className="mb-6 text-lg font-semibold text-black">Live Preview</h3>
        <div className="grid gap-8 rounded-lg bg-gray-50 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Contact</p>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Phone:</span> {form.phone || "—"}
              </p>
              <p>
                <span className="font-semibold">WhatsApp:</span> {form.whatsapp || "—"}
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {form.openingHours || "—"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {form.email || "—"}
              </p>
              <p className="pt-2">
                <span className="font-semibold">Address:</span>
                <br />
                {form.address || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Social Media</p>
            <div className="mt-3 space-y-2 text-sm">
              {form.instagram && (
                <p>
                  📸{" "}
                  <a
                    href={form.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E60000] hover:underline"
                  >
                    Instagram
                  </a>
                </p>
              )}
              {form.facebook && (
                <p>
                  👥{" "}
                  <a
                    href={form.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E60000] hover:underline"
                  >
                    Facebook
                  </a>
                </p>
              )}
              {form.twitter && (
                <p>
                  𝕏{" "}
                  <a
                    href={form.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E60000] hover:underline"
                  >
                    Twitter
                  </a>
                </p>
              )}
              {form.zomato && (
                <p>
                  🍽️{" "}
                  <a
                    href={form.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E60000] hover:underline"
                  >
                    Zomato
                  </a>
                </p>
              )}
              {form.swiggy && (
                <p>
                  🛵{" "}
                  <a
                    href={form.swiggy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E60000] hover:underline"
                  >
                    Swiggy
                  </a>
                </p>
              )}
              {!form.instagram &&
                !form.facebook &&
                !form.twitter &&
                !form.zomato &&
                !form.swiggy && <p className="text-gray-400">No social links added</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
