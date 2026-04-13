"use client";

import { useEffect, useState } from "react";

type ContentDocument = {
  heroTitle: string;
  heroSubtitle: string;
  whyChooseUs: string[];
  footerText: string;
  bestSellers: { title: string; subtitle: string; items: { name: string; description: string; tag: string }[] };
  weeklyOffers: { title: string; subtitle: string; items: { name: string; description: string; tag: string }[] };
};

const defaultContent: ContentDocument = {
  heroTitle: "",
  heroSubtitle: "",
  whyChooseUs: [""],
  footerText: "",
  bestSellers: { title: "", subtitle: "", items: [{ name: "", description: "", tag: "" }] },
  weeklyOffers: { title: "", subtitle: "", items: [{ name: "", description: "", tag: "" }] }
};

export function ContentManager() {
  const [content, setContent] = useState<ContentDocument>(defaultContent);
  const [form, setForm] = useState<ContentDocument>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadContent() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      const data = (await response.json()) as ContentDocument | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Unable to load content");
      }

      setContent(data);
      setForm({
        heroTitle: data.heroTitle ?? "",
        heroSubtitle: data.heroSubtitle ?? "",
        whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs : [""],
        footerText: data.footerText ?? "",
        bestSellers: data.bestSellers ? {
          title: data.bestSellers.title ?? "",
          subtitle: data.bestSellers.subtitle ?? "",
          items: Array.isArray(data.bestSellers.items) ? data.bestSellers.items.map(item => ({
            name: item.name ?? "",
            description: item.description ?? "",
            tag: item.tag ?? ""
          })) : [{ name: "", description: "", tag: "" }]
        } : defaultContent.bestSellers,
        weeklyOffers: data.weeklyOffers ? {
          title: data.weeklyOffers.title ?? "",
          subtitle: data.weeklyOffers.subtitle ?? "",
          items: Array.isArray(data.weeklyOffers.items) ? data.weeklyOffers.items.map(item => ({
            name: item.name ?? "",
            description: item.description ?? "",
            tag: item.tag ?? ""
          })) : [{ name: "", description: "", tag: "" }]
        } : defaultContent.weeklyOffers
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load content"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function handleFieldChange(field: keyof ContentDocument, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleWhyChooseChange(index: number, value: string) {
    setForm((current) => {
      const next = [...current.whyChooseUs];
      next[index] = value;
      return { ...current, whyChooseUs: next };
    });
  }

  function handleAddWhyPoint() {
    setForm((current) => ({
      ...current,
      whyChooseUs: [...current.whyChooseUs, ""]
    }));
  }

  function handleRemoveWhyPoint(index: number) {
    setForm((current) => ({
      ...current,
      whyChooseUs: current.whyChooseUs.filter((_, idx) => idx !== index)
    }));
  }

  function handleBestSellersChange(field: 'title' | 'subtitle', value: string) {
    setForm((current) => ({
      ...current,
      bestSellers: { ...current.bestSellers, [field]: value }
    }));
  }

  function handleBestSellersItemChange(index: number, field: 'name' | 'description' | 'tag', value: string) {
    setForm((current) => {
      const items = [...current.bestSellers.items];
      items[index] = { ...items[index], [field]: value };
      return { ...current, bestSellers: { ...current.bestSellers, items } };
    });
  }

  function handleAddBestSellersItem() {
    setForm((current) => ({
      ...current,
      bestSellers: {
        ...current.bestSellers,
        items: [...current.bestSellers.items, { name: "", description: "", tag: "" }]
      }
    }));
  }

  function handleRemoveBestSellersItem(index: number) {
    setForm((current) => ({
      ...current,
      bestSellers: {
        ...current.bestSellers,
        items: current.bestSellers.items.filter((_, idx) => idx !== index)
      }
    }));
  }

  function handleWeeklyOffersChange(field: 'title' | 'subtitle', value: string) {
    setForm((current) => ({
      ...current,
      weeklyOffers: { ...current.weeklyOffers, [field]: value }
    }));
  }

  function handleWeeklyOffersItemChange(index: number, field: 'name' | 'description' | 'tag', value: string) {
    setForm((current) => {
      const items = [...current.weeklyOffers.items];
      items[index] = { ...items[index], [field]: value };
      return { ...current, weeklyOffers: { ...current.weeklyOffers, items } };
    });
  }

  function handleAddWeeklyOffersItem() {
    setForm((current) => ({
      ...current,
      weeklyOffers: {
        ...current.weeklyOffers,
        items: [...current.weeklyOffers.items, { name: "", description: "", tag: "" }]
      }
    }));
  }

  function handleRemoveWeeklyOffersItem(index: number) {
    setForm((current) => ({
      ...current,
      weeklyOffers: {
        ...current.weeklyOffers,
        items: current.weeklyOffers.items.filter((_, idx) => idx !== index)
      }
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as ContentDocument | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Unable to save content");
      }

      setContent(data);
      setMessage("✓ Content saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save content"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setForm(content);
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
      <div>
        <h2 className="text-2xl font-bold text-black">Content Management</h2>
        <p className="mt-2 text-gray-600">Edit homepage copy and footer content</p>
      </div>

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

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">Hero Title</label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
              placeholder="Enter hero title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black">Hero Subtitle</label>
            <input
              type="text"
              value={form.heroSubtitle}
              onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
              placeholder="Enter hero subtitle"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">Why Choose Us</h3>
              <p className="text-sm text-gray-500">Add multiple selling points for the homepage.</p>
            </div>
            <button
              type="button"
              onClick={handleAddWhyPoint}
              className="rounded-full bg-[#E60000] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              + Add item
            </button>
          </div>

          <div className="space-y-3">
            {form.whyChooseUs.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleWhyChooseChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  className="flex-1 rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveWhyPoint(index)}
                  className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-black hover:border-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">Best Sellers</h3>
              <p className="text-sm text-gray-500">Manage best selling items section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddBestSellersItem}
              className="rounded-full bg-[#E60000] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              + Add item
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">Title</label>
              <input
                type="text"
                value={form.bestSellers.title}
                onChange={(e) => handleBestSellersChange("title", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                placeholder="Enter best sellers title"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">Subtitle</label>
              <input
                type="text"
                value={form.bestSellers.subtitle}
                onChange={(e) => handleBestSellersChange("subtitle", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                placeholder="Enter best sellers subtitle"
              />
            </div>
          </div>

          <div className="space-y-3">
            {form.bestSellers.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleBestSellersItemChange(index, "name", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleBestSellersItemChange(index, "description", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Tag</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => handleBestSellersItemChange(index, "tag", e.target.value)}
                        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                        placeholder="Tag"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBestSellersItem(index)}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black hover:border-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">Weekly Offers</h3>
              <p className="text-sm text-gray-500">Manage weekly offers section.</p>
            </div>
            <button
              type="button"
              onClick={handleAddWeeklyOffersItem}
              className="rounded-full bg-[#E60000] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              + Add item
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">Title</label>
              <input
                type="text"
                value={form.weeklyOffers.title}
                onChange={(e) => handleWeeklyOffersChange("title", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                placeholder="Enter weekly offers title"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">Subtitle</label>
              <input
                type="text"
                value={form.weeklyOffers.subtitle}
                onChange={(e) => handleWeeklyOffersChange("subtitle", e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
                placeholder="Enter weekly offers subtitle"
              />
            </div>
          </div>

          <div className="space-y-3">
            {form.weeklyOffers.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleWeeklyOffersItemChange(index, "name", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleWeeklyOffersItemChange(index, "description", e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Tag</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => handleWeeklyOffersItemChange(index, "tag", e.target.value)}
                        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#E60000] focus:outline-none"
                        placeholder="Tag"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWeeklyOffersItem(index)}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black hover:border-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">Footer Text</label>
          <textarea
            rows={4}
            value={form.footerText}
            onChange={(e) => handleFieldChange("footerText", e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none"
            placeholder="Enter footer text"
          />
        </div>

        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-lg bg-[#E60000] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400"
          >
            {isSaving ? "Saving..." : "Save Content"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
