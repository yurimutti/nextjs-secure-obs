"use client";

import dynamic from "next/dynamic";
import { RecentActivitiesSkeleton } from "@/components/loading/recent-activities-skeleton";

const RecentActivities = dynamic(
  () => import("./index").then((mod) => ({ default: mod.RecentActivities })),
  {
    loading: () => <RecentActivitiesSkeleton />,
    ssr: false,
  }
);

export function DynamicRecentActivities() {
  return <RecentActivities />;
}
