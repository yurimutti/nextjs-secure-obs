"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  useRecentActivities,
  useRefreshActivities,
} from "@/modules/dashboard/hooks/use-recent-activities";

const statusConfig = {
  success: {
    label: "Sucesso",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  warning: {
    label: "Aviso",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  error: {
    label: "Erro",
    className: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

export function RecentActivities() {
  const { data, isLoading, error, refetch } = useRecentActivities({ limit: 8 });

  const refreshMutation = useRefreshActivities();

  const activities = data?.activities ?? [];
  const isRefreshing = refreshMutation.isPending;

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync({ limit: 8 });
    } catch {}
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações e eventos do usuário</CardDescription>
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações e eventos do usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Erro ao carregar atividades"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              disabled={isRefreshing}
            >
              {isRefreshing ? "Tentando..." : "Tentar Novamente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações e eventos do usuário</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">
              Nenhuma atividade recente encontrada
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        statusConfig[activity.status].className
                      )}
                    >
                      {statusConfig[activity.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
