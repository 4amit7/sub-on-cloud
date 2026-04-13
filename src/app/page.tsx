import { readMenuFile } from "@/lib/menu-store";
import { BestSellersSection } from "@/components/best-sellers-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MenuSection } from "@/components/menu-section";
import { WeeklyOffersSection } from "@/components/weekly-offers-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const menu = await readMenuFile();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MenuSection initialMenu={menu} />
        <BestSellersSection />
        <WeeklyOffersSection />
      </main>
      <Footer />
    </>
  );
}
