import Image from "next/image";
import type { MenuItem } from "@/types/menu";

type MenuCardProps = {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
};

export function MenuCard({ item, addToCart }: MenuCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
      <div className="relative h-52 overflow-hidden bg-[#fff7dd]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-black">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-black/60">
              {item.description}
            </p>
          </div>
          <span className="text-lg font-bold text-[#E60000]">Rs. {item.price}</span>
        </div>

        <button
          onClick={() => addToCart(item)}
          className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white group-hover:bg-[#E60000]">
          Add to Cart
        </button>
      </div>
    </article>
  );
}
