"use client";

import { useEffect, useState } from "react";

type ContentDocument = {
  heroTitle: string;
  heroSubtitle: string;
  whyChooseUs: string[];
  footerText: string;
  bestSellers: { title: string; subtitle: string; items: string[] };
  weeklyOffers: { title: string; subtitle: string; items: string[] };
};

interface UseContentReturn {
  content: ContentDocument | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const defaultContent: ContentDocument = {
  heroTitle: "Fresh Healthy Subs & Wraps in Vadodara",
  heroSubtitle:
    "Crafted with crisp ingredients, bold sauces and feel-good fillings, delivered hot from our kitchen to your doorstep.",
  whyChooseUs: [
    "Toasted breads, fresh salads and house-made sauces.",
    "Fast delivery across Vadodara.",
    "Healthy bites with real flavor."
  ],
  footerText: "Fresh healthy subs, wraps and quick bites made for modern delivery. Serving hungry customers across Vadodara.",
  bestSellers: { title: "", subtitle: "", items: [] },
  weeklyOffers: { title: "", subtitle: "", items: [] }
};

export function useContent(): UseContentReturn {
  const [content, setContent] = useState<ContentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      const data = (await response.json()) as ContentDocument | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Unable to load content");
      }

      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchContent();
  }, []);

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  };
}
