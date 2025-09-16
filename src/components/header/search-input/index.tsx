"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <>
      <div className="hidden sm:block">
        <div className="relative" id="search">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10 md:w-80"
            aria-label="Search"
          />
        </div>
      </div>

      <Button variant="ghost" size="sm" className="sm:hidden">
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    </>
  );
}