"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import MarketplaceGrid from "@/components/marketplace/marketplace-grid";
import MarketplaceFilters, { type MarketplaceFilters as FilterOptions } from "@/components/marketplace/marketplace-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

// Demo marketplace data with Nigerian university context
const demoMarketplaceItems = [
  {
    id: "1",
    title: "UNILAG Branded Laptop Bag",
    description: "Official University of Lagos laptop bag, barely used. Perfect for students!",
    price: 15000,
    category: "Electronics & Accessories",
    condition: "Like New",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller1",
      name: "Chioma O.",
      university: "UNILAG",
      rating: 4.8,
      avatar: "/placeholder.svg"
    },
    location: "Akoka, Lagos",
    posted_at: "2 hours ago"
  },
  {
    id: "2",
    title: "Engineering Textbooks Bundle",
    description: "Complete set of engineering textbooks for 200-300 level courses. All major subjects included.",
    price: 45000,
    category: "Books & Education",
    condition: "Good",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller2",
      name: "Emeka N.",
      university: "UNN",
      rating: 4.9,
      avatar: "/placeholder.svg"
    },
    location: "Nsukka, Enugu",
    posted_at: "1 day ago"
  },
  {
    id: "3",
    title: "iPhone 13 Pro Max",
    description: "Excellent condition iPhone 13 Pro Max, 256GB. Used by a careful medical student.",
    price: 850000,
    category: "Mobile Phones",
    condition: "Excellent",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller3",
      name: "Blessing O.",
      university: "UNIBEN",
      rating: 5.0,
      avatar: "/placeholder.svg"
    },
    location: "Benin City, Edo",
    posted_at: "3 days ago"
  },
  {
    id: "4",
    title: "Study Desk & Chair Set",
    description: "Comfortable study setup perfect for long study sessions. Moving out sale!",
    price: 25000,
    category: "Furniture",
    condition: "Good",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller4",
      name: "Kemi A.",
      university: "UI",
      rating: 4.7,
      avatar: "/placeholder.svg"
    },
    location: "Ibadan, Oyo",
    posted_at: "1 week ago"
  },
  {
    id: "5",
    title: "Laboratory Coat & Equipment",
    description: "Medical laboratory coat and basic equipment for medical/science students.",
    price: 12000,
    category: "Academic Supplies",
    condition: "Like New",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller5",
      name: "Dr. Hassan M.",
      university: "ABU",
      rating: 4.9,
      avatar: "/placeholder.svg"
    },
    location: "Zaria, Kaduna",
    posted_at: "5 days ago"
  },
  {
    id: "6",
    title: "Graphics Tablet for Design",
    description: "Wacom graphics tablet, perfect for art and design students. Comes with pen and software.",
    price: 65000,
    category: "Electronics & Accessories",
    condition: "Excellent",
    images: ["/placeholder.svg"],
    seller: {
      id: "seller6",
      name: "Funmi A.",
      university: "OAU",
      rating: 4.8,
      avatar: "/placeholder.svg"
    },
    location: "Ile-Ife, Osun",
    posted_at: "2 days ago"
  }
];

const defaultFilters: FilterOptions = {
  search: "",
  category: "all",
  minPrice: 0,
  maxPrice: 1000000,
  condition: "all",
  sortBy: "newest"
};

export default function MarketplacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth");
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">Please sign in to access the marketplace</p>
            <Button onClick={() => router.push('/auth')}>
              Sign In
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">University Marketplace</h1>
          <p className="text-gray-600">Buy and sell items within the Nigerian university community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <MarketplaceFilters
              onFiltersChange={setFilters}
              initialFilters={defaultFilters}
            />
          </div>
          <div className="md:col-span-3">
            <MarketplaceGrid items={demoMarketplaceItems} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// All marketplace routes are disabled in production except auth and feed.
