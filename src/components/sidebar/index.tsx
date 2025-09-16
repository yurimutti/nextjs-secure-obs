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
          <ul className="space-y-1" aria-labelledby="nav-heading">
            <li>
              <Button
                variant="secondary"
                className="w-full justify-start text-sm font-medium"
                aria-current="page"
              >
                <Home className="mr-3 h-4 w-4" aria-hidden="true" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium hover:bg-accent"
              >
                <BarChart3 className="mr-3 h-4 w-4" aria-hidden="true" />
                Analytics
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium hover:bg-accent"
              >
                <CreditCard className="mr-3 h-4 w-4" aria-hidden="true" />
                Billing
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium hover:bg-accent"
              >
                <Settings className="mr-3 h-4 w-4" aria-hidden="true" />
                Settings
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
