"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import MarketplaceGrid from "@/components/marketplace/marketplace-grid";
import MarketplaceFilters, { type MarketplaceFilters as FilterOptions } from "@/components/marketplace/marketplace-filters";

const defaultFilters: FilterOptions = {
  search: "",
  category: "all",
  minPrice: 0,
  maxPrice: 1000,
  condition: "all",
  sortBy: "newest"
};

export default function MarketplacePage() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <MarketplaceFilters
              onFiltersChange={setFilters}
              initialFilters={defaultFilters}
            />
          </div>
          <div className="md:col-span-3">
            <MarketplaceGrid filters={filters} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
