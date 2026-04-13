"use client";

import { useEffect, useState } from "react";
import { notifyMenuUpdated } from "@/lib/menu-sync";
import type { MenuItemPayload, MenuResponse } from "@/types/menu";

type FormState = {
  id?: string;
  categoryName: string;
  name: string;
  price: string;
  image: string;
  description: string;
};

const emptyForm: FormState = {
  categoryName: "Subs",
  name: "",
  price: "",
  image: "/images/sub1.svg",
  description: ""
};

export function AdminPanel() {
  const [menu, setMenu] = useState<MenuResponse>({ categories: [] });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadMenu() {
    setError("");

    try {
      const response = await fetch("/api/menu", { cache: "no-store" });
      const data = (await response.json()) as MenuResponse | { error: string };

      if (!response.ok || !("categories" in data)) {
        throw new Error(
          "error" in data ? data.error : "Unable to load menu items."
        );
      }

      setMenu(data);
      setForm((current) => ({
        ...current,
        categoryName: current.categoryName || data.categories[0]?.name || "Subs"
      }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load menu items."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadMenu();
  }, []);

  function startEdit(item: MenuItemPayload) {
    setMessage("");
    setError("");
    setForm({
      id: item.id,
      categoryName: item.categoryName,
      name: item.name,
      price: String(item.price),
      image: item.image,
      description: item.description
    });
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      categoryName: menu.categories[0]?.name || "Subs"
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    const payload: MenuItemPayload = {
      id: form.id,
      categoryName: form.categoryName.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      description: form.description.trim()
    };

    const method = form.id ? "PUT" : "POST";

    try {
      const response = await fetch("/api/menu", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as MenuResponse | { error: string };

      if (!response.ok || !("categories" in data)) {
        throw new Error("error" in data ? data.error : "Unable to save item");
      }

      setMenu(data);
      setMessage(form.id ? "Item updated successfully." : "Item added successfully.");
      setForm({
        ...emptyForm,
        categoryName: data.categories[0]?.name || "Subs"
      });
      notifyMenuUpdated();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to save item."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = (await response.json()) as MenuResponse | { error: string };

      if (!response.ok || !("categories" in data)) {
        throw new Error("error" in data ? data.error : "Unable to delete item");
      }

      setMenu(data);
      setMessage("Item deleted successfully.");
      notifyMenuUpdated();

      if (form.id === id) {
        setForm({
          ...emptyForm,
          categoryName: data.categories[0]?.name || "Subs"
        });
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete item."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const rows = menu.categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryName: category.name
    }))
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E60000]">
            Admin Panel
          </p>
          <h1 className="mt-3 text-4xl font-bold text-black">Manage Menu Items</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-black/65">
            Add, edit and delete menu items stored in `data/menu.json`. Updates are
            saved to the file and reflected on the website instantly through the
            shared API.
          </p>
        </div>
        <button
          onClick={resetForm}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:border-[#FFC107]"
        >
          New Item
        </button>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-[#E60000]/20 bg-[#fff5f5] px-5 py-4 text-sm text-[#E60000]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Item</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Image</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-black/60">
                      Loading menu items...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-black/60">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr key={item.id} className="border-t border-black/5 align-top">
                      <td className="px-5 py-4 font-medium text-black">
                        {item.categoryName}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-black">{item.name}</p>
                        <p className="mt-1 max-w-sm text-black/60">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#E60000]">
                        Rs. {item.price}
                      </td>
                      <td className="px-5 py-4 text-black/60">{item.image}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-full bg-[#FFC107] px-4 py-2 font-semibold text-black hover:bg-[#ffcf40]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(item.id!)}
                            className="rounded-full bg-[#E60000] px-4 py-2 font-semibold text-white hover:bg-black"
                            disabled={isSaving}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-bold text-black">
            {form.id ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Use the form below to update the JSON menu source.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-black">
                Category
              </span>
              <input
                value={form.categoryName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    categoryName: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-0 transition focus:border-[#FFC107]"
                placeholder="Subs"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-black">
                Item Name
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-0 transition focus:border-[#FFC107]"
                placeholder="Peri Peri Paneer Sub"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-black">
                Price
              </span>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: event.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-0 transition focus:border-[#FFC107]"
                placeholder="120"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-black">
                Image Path
              </span>
              <input
                value={form.image}
                onChange={(event) =>
                  setForm((current) => ({ ...current, image: event.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-0 transition focus:border-[#FFC107]"
                placeholder="/images/sub1.svg"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-black">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
                rows={4}
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-0 transition focus:border-[#FFC107]"
                placeholder="Spicy grilled paneer sub"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#E60000] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : form.id ? "Update Item" : "Add Item"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black hover:border-[#FFC107]"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
