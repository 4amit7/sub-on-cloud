"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuCard } from "@/components/menu-card";
import { SectionHeading } from "@/components/section-heading";
import { subscribeToMenuUpdates } from "@/lib/menu-sync";
import type { MenuCategory, MenuResponse, MenuItem } from "@/types/menu";

type MenuSectionProps = {
  initialMenu: MenuResponse;
};

export function MenuSection({ initialMenu }: MenuSectionProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<MenuCategory[]>(
    initialMenu.categories
  );
  const [activeCategory, setActiveCategory] = useState(
    initialMenu.categories[0]?.name ?? ""
  );
  const [isLoading, setIsLoading] = useState(initialMenu.categories.length === 0);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<(MenuItem & { qty?: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem) => {
    const normalizedItem = {
      ...item,
      id: item.id || `${activeCategory}-${item.name}`
    };

    setCart(prev => {
      const existing = prev.find(i => i.id === normalizedItem.id);

      if (existing) {
        return prev.map(i =>
          i.id === normalizedItem.id
            ? { ...i, qty: (i.qty || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...normalizedItem, qty: 1 }];
    });
  };

  const increaseQty = (index: number) => {
    setCart(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (index: number) => {
    setCart(prev =>
      prev
        .map((item, i) =>
          i === index
            ? { ...item, qty: (item.qty || 1) - 1 }
            : item
        )
        .filter(item => (item.qty || 1) > 0)
    );
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  useEffect(() => {
    let isMounted = true;

    async function loadMenu(background = false) {
      if (!background) {
        setIsLoading(true);
      }

      try {
        const response = await fetch("/api/menu", {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load menu");
        }

        const data = (await response.json()) as MenuResponse;

        if (!isMounted) {
          return;
        }

        setCategories(data.categories);
        setActiveCategory((current) => {
          if (data.categories.some((category) => category.name === current)) {
            return current;
          }

          return data.categories[0]?.name ?? "";
        });
        setError("");
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : "Failed to load menu"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    const unsubscribe = subscribeToMenuUpdates(() => {
      void loadMenu(true);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const activeItems =
    categories.find((category) => category.name === activeCategory)?.items ?? [];

  return (
    <>
      {/* Floating Cart Indicator - Clickable */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50 hover:bg-[#E60000] transition"
      >
        🛒 {cart.length}
      </button>

      {/* Sliding Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-black">Your Cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl text-black hover:text-[#E60000]"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2 mx-2">
                  <button
                    onClick={() => decreaseQty(index)}
                    className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 text-black"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-black">{item.qty || 1}</span>
                  <button
                    onClick={() => increaseQty(index)}
                    className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 text-black"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-[#E60000] transition font-semibold"
            >
              Checkout ₹{total}
            </button>
          </div>
        )}
      </div>

      <section id="menu" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Our Menu"
          title="Choose from subs, wraps, burgers and cool drinks"
          description="The menu is loaded dynamically from a JSON file, so categories and items can change without rewriting the UI."
        />
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = category.name === activeCategory;

            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${
                  active
                    ? "bg-[#E60000] text-white shadow-lg shadow-red-200"
                    : "border border-black/10 bg-white text-black hover:border-[#FFC107]"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-10 rounded-[1.75rem] border border-black/10 bg-white p-8 text-sm text-black/65 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          Loading menu...
        </div>
      ) : error ? (
        <div className="mt-10 rounded-[1.75rem] border border-[#E60000]/20 bg-[#fff5f5] p-8 text-sm text-[#E60000]">
          {error}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {activeItems.map((item) => (
            <MenuCard key={`${activeCategory}-${item.name}`} item={item} addToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
    </>
  );
}
