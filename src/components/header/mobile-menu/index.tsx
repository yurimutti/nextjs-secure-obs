"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  children: React.ReactNode;
}

export function MobileMenu({ children }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="mr-3 px-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 pr-0">
        <div className="px-3">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 pb-4"
          >
            <span className="font-bold text-lg">Secure Dashboard</span>
          </Link>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}