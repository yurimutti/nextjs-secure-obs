"use client";

import dynamic from "next/dynamic";
import { SentryTestSkeleton } from "@/components/loading/sentry-test-skeleton";

const SentryErrorTest = dynamic(
  () => import("./index").then((mod) => ({ default: mod.SentryErrorTest })),
  {
    loading: () => <SentryTestSkeleton />,
    ssr: false,
  }
);

export function DynamicSentryErrorTest() {
  return <SentryErrorTest />;
}