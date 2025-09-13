import { StatCard } from "@/components/stat-card";
import { RecentActivityTable } from "@/components/recent-activity-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockStats, mockActivity } from "@/shared/libs/mock";
import { getSession } from "@/shared/libs/session";
import { cookies } from "next/headers";

// TODO: cookie handling
const getUserProfile = async () => {
  try {
    const session = await getSession();
    if (!session) return null;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user-profile`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie
            ? `${sessionCookie.name}=${sessionCookie.value}`
            : "",
        },
      }
    );

    if (!response.ok) {
      console.log("API request failed:", response.status);
      return null;
    }

    const data = await response.json();

    // Return only safe, necessary data for the client
    return {
      name: data.name || null,
      email: data.email || null,
      memberSince: data.memberSince || null,
      // Only include fields that are safe to expose
      // Exclude sensitive data like passwords, tokens, etc.
    };
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return null;
  }
};

export default async function Dashboard() {
  const userProfile = await getUserProfile();
  console.log("User Profile:", userProfile);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of your application metrics and recent activity
        </p>
      </div>

      {/* User Profile Section */}
      {userProfile && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {userProfile.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {userProfile.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Member Since
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {userProfile.memberSince}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                <div className="text-lg font-medium mb-2">
                  Chart Placeholder
                </div>
                <div className="text-sm">No chart library integrated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and events</CardDescription>
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
    </>
  );
}
