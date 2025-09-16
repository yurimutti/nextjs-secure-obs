import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function RecentActivitiesSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Loading your latest actions and events
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Loading activities"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse w-16" />
                <div className="h-3 bg-muted rounded animate-pulse w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
