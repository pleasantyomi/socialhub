"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type MarketplaceFilters = {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  condition: string;
  sortBy: "newest" | "price_low" | "price_high";
};

type MarketplaceFiltersProps = {
  onFiltersChange: (filters: MarketplaceFilters) => void;
  initialFilters?: Partial<MarketplaceFilters>;
};

const CONDITIONS = ["new", "like_new", "good", "fair", "poor"] as const;
const CATEGORIES = [
  "all",
  "electronics",
  "clothing",
  "furniture",
  "books",
  "other",
] as const;

export default function MarketplaceFilters({
  onFiltersChange,
  initialFilters = {},
}: MarketplaceFiltersProps) {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    condition: "all",
    sortBy: "newest",
    ...initialFilters,
  });

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFiltersChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="pt-2">
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={1000}
              step={10}
              onValueChange={([min, max]) =>
                setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
              }
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                ${filters.minPrice}
              </span>
              <span className="text-sm text-muted-foreground">
                ${filters.maxPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <Select
            value={filters.condition}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, condition: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Condition</SelectItem>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: "newest" | "price_low" | "price_high") =>
              setFilters((prev) => ({ ...prev, sortBy: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
