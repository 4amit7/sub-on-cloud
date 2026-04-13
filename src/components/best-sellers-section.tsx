"use client";

import { useContent } from "@/hooks";
import { SectionHeading } from "@/components/section-heading";

export function BestSellersSection() {
  const { content } = useContent();

  const title = content?.bestSellers?.title || "Best Sellers";
  const subtitle = content?.bestSellers?.subtitle || "Most-loved picks from the Sub On Cloud kitchen";
  const items = content?.bestSellers?.items || [];

  return (
    <section
      id="best-sellers"
      className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10"
    >
      <div className="rounded-[2rem] bg-black px-6 py-10 text-white md:px-10 md:py-14">
        <SectionHeading
          eyebrow={title}
          title={subtitle}
          description="Our fast-moving favorites balance taste, texture and freshness for repeat orders."
          theme="dark"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={index}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFC107]">
                  0{index + 1}
                </span>
                <span className="rounded-full bg-[#E60000] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                  {item.tag || "Popular"}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{item.name || "Item Name"}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{item.description || "Item description"}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
