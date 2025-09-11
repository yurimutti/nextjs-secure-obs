import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ActivityRow } from '@/shared/libs/mock';

// Adapted from shadcn/ui Blocks: Dashboard > Data tables
// https://ui.shadcn.com/blocks#dashboard
interface RecentActivityTableProps {
  activities: ActivityRow[];
}

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  const getStatusVariant = (status: ActivityRow['status']) => {
    switch (status) {
      case 'success':
        return 'default' as const;
      case 'warning':
        return 'secondary' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 sm:w-32">Date</TableHead>
            <TableHead className="min-w-[200px]">User</TableHead>
            <TableHead className="hidden sm:table-cell">Action</TableHead>
            <TableHead className="w-20">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium text-xs sm:text-sm">
                {new Date(activity.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell className="text-xs sm:text-sm">
                <div className="max-w-[150px] sm:max-w-none truncate">
                  {activity.user}
                </div>
                <div className="sm:hidden text-xs text-muted-foreground mt-1">
                  {activity.action}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm">
                {activity.action}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getStatusVariant(activity.status)}
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}