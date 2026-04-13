"use client";

import { useSettings, useContent } from "@/hooks";

export function HeroSection() {
  const { settings } = useSettings();
  const { content, loading: contentLoading } = useContent();

  const heroTitle =
    content?.heroTitle || "Fresh Healthy Subs & Wraps in Vadodara";
  const heroSubtitle =
    content?.heroSubtitle ||
    "Crafted with crisp ingredients, bold sauces and feel-good fillings, delivered hot from our kitchen to your doorstep.";
  const whyChooseUs =
    content?.whyChooseUs?.length && !contentLoading
      ? content.whyChooseUs
      : [
          "Toasted breads, fresh salads and house-made sauces.",
          "Fast delivery across Vadodara.",
          "Healthy bites with real flavor."
        ];

  const zomatoUrl = settings?.zomato || "https://www.zomato.com";
  const showZomatoButton = !!settings?.zomato;
  const swiggyUrl = settings?.swiggy || "https://www.swiggy.com";
  const showSwiggyButton = !!settings?.swiggy;

  return (
    <section
      id="home"
      className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24 lg:pt-16"
    >
      <div className="flex flex-col justify-center">
        <div className="mb-6 inline-flex w-fit rounded-full border border-[#FFC107]/50 bg-[#FFC107]/15 px-4 py-2 text-sm font-semibold text-[#E60000]">
          Cloud Kitchen in Vadodara
        </div>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-black md:text-6xl">
          {heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
          {heroSubtitle}
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff8f0] p-6 text-sm text-black/80 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#E60000]">
            Why choose us
          </p>
          <ul className="space-y-2">
            {whyChooseUs.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 text-[#E60000]">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {/* Zomato Button - Hidden if not configured */}
          {showZomatoButton && (
            <a
              href={zomatoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E60000] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:-translate-y-0.5 hover:bg-black transition"
            >
              Order on Zomato
            </a>
          )}

          {/* Swiggy Button - Hidden if not configured */}
          {showSwiggyButton && (
            <a
              href={swiggyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E60000] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:-translate-y-0.5 hover:bg-black transition"
            >
              Order on Swiggy
            </a>
          )}

          <a
            href={`https://wa.me/${settings?.whatsapp || "919999999999"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black px-7 py-4 text-sm font-semibold text-black hover:border-[#E60000] hover:text-[#E60000] transition"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full bg-[#FFC107]/60 blur-2xl md:block" />
        <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rounded-full bg-[#E60000]/20 blur-3xl md:block" />
        <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_30px_80px_rgba(230,0,0,0.14)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-[#FFC107] to-[#fff1b3] p-5 text-black">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                Signature
              </p>
              <h3 className="mt-10 text-2xl font-bold">Loaded Subs</h3>
              <p className="mt-2 text-sm text-black/70">
                Toasted breads, fresh salads and house-made sauces.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107]">
                Fast Delivery
              </p>
              <h3 className="mt-10 text-2xl font-bold">20-30 mins</h3>
              <p className="mt-2 text-sm text-white/70">
                Freshly prepared and packed for quick delivery across Vadodara.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-5 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107]">
                    Why people love us
                  </p>
                  <h3 className="mt-3 text-3xl font-bold">Healthy bites with real flavor</h3>
                </div>
                <div className="rounded-full bg-[#E60000] px-5 py-3 text-sm font-semibold">
                  4.8 Avg Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
