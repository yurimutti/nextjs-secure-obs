import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SkipLinks } from "@/components/skip-link";
import { requireSession } from "@/shared/libs/dal";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <Header>
        <Sidebar />
      </Header>

      <div className="flex">
        <div className="hidden border-r bg-background/50 md:block md:w-64 lg:w-72" id="main-navigation">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
