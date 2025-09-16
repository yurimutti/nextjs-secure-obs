import { cn } from "@/shared/utils/cn";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, CreditCard, Settings } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={cn("pb-6", className)} role="navigation" aria-label="Main navigation">
      <div className="space-y-6 py-4">
        <div className="px-3">
          <h2 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider" id="nav-heading">
            Navigation
          </h2>
          <div className="space-y-1" role="list" aria-labelledby="nav-heading">
            <Button
              variant="secondary"
              className="w-full justify-start text-sm font-medium"
              role="listitem"
              aria-current="page"
            >
              <Home className="mr-3 h-4 w-4" aria-hidden="true" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
              role="listitem"
            >
              <BarChart3 className="mr-3 h-4 w-4" aria-hidden="true" />
              Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
              role="listitem"
            >
              <CreditCard className="mr-3 h-4 w-4" aria-hidden="true" />
              Billing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
              role="listitem"
            >
              <Settings className="mr-3 h-4 w-4" aria-hidden="true" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
