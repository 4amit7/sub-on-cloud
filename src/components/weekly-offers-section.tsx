"use client";

import { useContent } from "@/hooks";
import { SectionHeading } from "@/components/section-heading";

export function WeeklyOffersSection() {
  const { content } = useContent();

  const title = content?.weeklyOffers?.title || "Weekly Offers";
  const subtitle = content?.weeklyOffers?.subtitle || "Special deals and limited-time offers";
  const items = (content?.weeklyOffers?.items || []) as any[];

  return (
    <section
      id="weekly-offers"
      className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10"
    >
      <div className="rounded-[2rem] bg-black px-6 py-10 text-white md:px-10 md:py-14">
        <SectionHeading
          eyebrow={title}
          title={subtitle}
          description="Take advantage of our weekly specials and exclusive offers."
          theme="dark"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item: any, index) => (
            <article
              key={index}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFC107]">
                  0{index + 1}
                </span>
                <span className="rounded-full bg-[#E60000] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                  {item.tag || "Offer"}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{item.name || "Offer Name"}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{item.description || "Offer description"}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
