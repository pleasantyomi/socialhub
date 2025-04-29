import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import MarketplaceGrid from "@/components/marketplace/marketplace-grid";
import MarketplaceFilters from "@/components/marketplace/marketplace-filters";

export const metadata: Metadata = {
  title: "Marketplace | SocialHub",
  description: "Buy and sell items",
};

export default function MarketplacePage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <MarketplaceFilters />
          </div>
          <div className="md:col-span-3">
            <MarketplaceGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
