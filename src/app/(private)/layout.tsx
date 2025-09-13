import { redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { getSession } from '@/shared/libs/session';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session === null) {
    return redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <Sidebar />
      </Header>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-background/50 md:block md:w-64 lg:w-72">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
