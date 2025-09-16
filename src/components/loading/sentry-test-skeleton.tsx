import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SentryTestSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          <div className="h-5 bg-muted rounded animate-pulse w-24" />
        </CardTitle>
        <CardDescription>
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-9 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}
