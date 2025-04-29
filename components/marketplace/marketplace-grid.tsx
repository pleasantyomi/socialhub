import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getMarketplaceItems } from "@/lib/data";

export default function MarketplaceGrid() {
  const items = getMarketplaceItems();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link href={`/marketplace/${item.id}`} key={item.id}>
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
              <p>
                {item.location} • {item.listedTime}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
