"use client";

import { useState } from "react";
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

export default function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Search items..." />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="pt-2">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                onValueChange={setPriceRange}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="new" />
              <Label htmlFor="new" className="font-normal">
                New
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="like-new" />
              <Label htmlFor="like-new" className="font-normal">
                Like New
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="good" />
              <Label htmlFor="good" className="font-normal">
                Good
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fair" />
              <Label htmlFor="fair" className="font-normal">
                Fair
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Select defaultValue="nearby">
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearby">Nearby</SelectItem>
              <SelectItem value="5miles">Within 5 miles</SelectItem>
              <SelectItem value="10miles">Within 10 miles</SelectItem>
              <SelectItem value="25miles">Within 25 miles</SelectItem>
              <SelectItem value="50miles">Within 50 miles</SelectItem>
              <SelectItem value="anywhere">Anywhere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
