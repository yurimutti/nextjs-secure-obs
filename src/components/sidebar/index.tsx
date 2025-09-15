import { cn } from "@/shared/utils/cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, BarChart3, CreditCard, Settings } from "lucide-react";

// Adapted from shadcn/ui Blocks: Dashboard > Sidebar navigation
// https://ui.shadcn.com/blocks#dashboard
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-6", className)}>
      <div className="space-y-6 py-4">
        {/* Main Navigation */}
        <div className="px-3">
          <h2 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </h2>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className="w-full justify-start text-sm font-medium"
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
            >
              <CreditCard className="mr-3 h-4 w-4" />
              Billing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium hover:bg-accent"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Separator className="mx-3" />

        {/* Recent Section */}
        <div className="px-3">
          <h2 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal hover:bg-accent"
            >
              <span className="truncate">Dashboard Overview</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal hover:bg-accent"
            >
              <span className="truncate">User Management</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal hover:bg-accent"
            >
              <span className="truncate">System Logs</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal hover:bg-accent"
            >
              <span className="truncate">API Documentation</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
