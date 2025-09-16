"use client";

import { cn } from "@/shared/utils/cn";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-50",
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-md",
        "text-sm font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        "transition-all duration-200",
        className
      )}
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#main-navigation">Skip to navigation</SkipLink>
      <SkipLink href="#search">Skip to search</SkipLink>
    </>
  );
}
