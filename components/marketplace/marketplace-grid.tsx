"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getMarketplaceItems } from "@/lib/data";
import { MarketplaceItem } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MarketplaceFilters } from "./marketplace-filters";

// Demo data as fallback
const demoItems = [
	{
		id: "1",
		title: "Demo Item",
		description: "This is a demo item while the real items load.",
		price: 99.99,
		images: ["/placeholder.svg"],
		category: "other",
		condition: "new",
		location: "Campus Area",
		seller_id: "demo",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		profiles: {
			id: "demo",
			username: "demo_user",
			full_name: "Demo User",
			avatar_url: "/placeholder.svg",
			website: null,
			bio: null,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	},
] as MarketplaceItem[];

type MarketplaceGridProps = {
	filters?: MarketplaceFilters;
	items?: any[]; // Allow custom items to be passed
};

export default function MarketplaceGrid({ filters, items: customItems }: MarketplaceGridProps) {
	const [items, setItems] = useState<MarketplaceItem[]>(customItems as MarketplaceItem[] || demoItems);
	const [loading, setLoading] = useState(!customItems);
	
	useEffect(() => {
		if (customItems) {
			setItems(customItems as MarketplaceItem[]);
			setLoading(false);
			return;
		}
		loadItems();
	}, [filters, customItems]);

	async function loadItems() {
		if (!filters) return;
		
		try {
			const fetchedItems = await getMarketplaceItems(filters);
			setItems(fetchedItems);
		} catch (error) {
			console.error("Failed to load marketplace items:", error);
			toast.error("Failed to load items. Using demo data instead.");
		} finally {
			setLoading(false);
		}
	}

	// Apply filters to items
	const filteredItems = items
		.filter((item) => {
			if (!filters) return true;
			
			if (
				filters.search &&
				!item.title.toLowerCase().includes(filters.search.toLowerCase())
			) {
				return false;
			}
			if (filters.category !== "all" && item.category !== filters.category) {
				return false;
			}
			if (item.price < filters.minPrice || item.price > filters.maxPrice) {
				return false;
			}
			if (filters.condition !== "all" && item.condition !== filters.condition) {
				return false;
			}
			return true;
		})
		.sort((a, b) => {
			if (!filters) return 0;
			
			switch (filters.sortBy) {
				case "price_low":
					return a.price - b.price;
				case "price_high":
					return b.price - a.price;
				case "newest":
				default:
					return (
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime()
					);
			}
		});

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (filteredItems.length === 0) {
		return (
			<div className="text-center py-12">
				<h3 className="text-lg font-semibold">No items found</h3>
				<p className="text-muted-foreground mt-1">
					Try adjusting your filters
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{filteredItems.map((item) => (
				<Link href={`/marketplace/${item.id}`} key={item.id}>
					<Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
						<div className="relative aspect-square">
							<Image
								src={item.images[0] || "/placeholder.svg"}
								alt={item.title}
								fill
								className="object-cover w-full h-full object-center"
							/>
						</div>
						<CardContent className="p-4">
							<h3 className="font-semibold text-lg">{item.title}</h3>
							<p className="text-primary font-bold">
								${item.price.toFixed(2)}
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								{item.condition
									.split("_")
									.map(
										(word) =>
											word.charAt(0).toUpperCase() + word.slice(1)
									)
									.join(" ")}
							</p>
						</CardContent>
						<CardFooter className="p-4 pt-0 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								{item.location}
							</p>
							<p className="text-sm text-muted-foreground">
								{new Date(item.created_at).toLocaleDateString()}
							</p>
						</CardFooter>
					</Card>
				</Link>
			))}
		</div>
	);
}
