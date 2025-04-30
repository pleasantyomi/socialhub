"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export default function NotificationFilters() {
  const [filter, setFilter] = useState("all");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
          <DropdownMenuRadioItem value="all">
            All notifications
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mentions">
            Mentions
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="follows">Follows</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="likes">Likes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comments">
            Comments
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
