"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorNotFound = () => {
  const router = useRouter();

  const onReload = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="overflow m-auto flex min-h-screen w-full max-w-[1200px] flex-col-reverse items-center justify-center gap-8 p-8 md:flex-row md:justify-between md:gap-32 md:p-12">
      <section className="text-center md:text-left">
        <span className="text-[96px] font-bold leading-[100px] text-muted-foreground md:text-[150px]">
          404
        </span>
        <h2 className="pb-4 pt-2 text-2xl font-bold text-foreground md:pb-8 md:text-4xl">
          Page not found
        </h2>

        <div className="flex flex-col gap-1 pb-12 md:gap-3">
          <h3 className="text-lg font-bold text-foreground md:text-xl">
            Unfortunately, this page didn&apos;t take off!
          </h3>
          <p className="text-muted-foreground">
            Try again and if it still doesn&apos;t work, you can contact our
            Support.
          </p>
        </div>

        <Button
          onClick={onReload}
          className="w-full px-12 md:w-auto"
          variant="default"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh page
        </Button>
      </section>

      <div className="h-[180px] w-[220px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center md:h-[392px] md:w-[376px]">
        <div className="text-6xl md:text-8xl opacity-50">🚀</div>
      </div>
    </div>
  );
};

export { ErrorNotFound };
