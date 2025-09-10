import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StatCard as StatCardType } from '@/shared/libs/mock';

// Adapted from shadcn/ui Blocks: Dashboard > Stats cards
// https://ui.shadcn.com/blocks#dashboard
interface StatCardProps {
  stat: StatCardType;
}

export function StatCard({ stat }: StatCardProps) {
  const isPositive = stat.changeType === 'positive';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {stat.title}
        </CardTitle>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <Badge variant={isPositive ? "default" : "destructive"} className="mt-2">
          {stat.change}
        </Badge>
      </CardContent>
    </Card>
  );
}