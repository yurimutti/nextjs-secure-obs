import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { StatCard } from '@/components/stat-card';
import { RecentActivityTable } from '@/components/recent-activity-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStats, mockActivity } from '@/shared/libs/mock';

export default function Dashboard() {
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Overview of your application metrics and recent activity
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {mockStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
            
            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    Chart visualization would be displayed here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2">Chart Placeholder</div>
                      <div className="text-sm">No chart library integrated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest user actions and events
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-64 overflow-y-auto">
                    <RecentActivityTable activities={mockActivity.slice(0, 5)} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Full Activity Table */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Complete history of user actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <RecentActivityTable activities={mockActivity} />
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}