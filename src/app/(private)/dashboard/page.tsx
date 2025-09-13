import { StatCard } from "@/components/stat-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockStats } from "@/shared/libs/mock";
import { verifySession } from "@/shared/libs/dal";
import { authFetchServer } from "@/modules/auth/utils/server";
import { RecentActivities } from "@/components/recent-activities";

const getUserProfile = async () => {
  try {
    const response = await authFetchServer("/api/user-profile");

    if (!response?.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name || null,
      email: data.email || null,
      memberSince: data.memberSince || null,
    };
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return null;
  }
};

export default async function Dashboard() {
  await verifySession();

  const userProfile = await getUserProfile();

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
                {userProfile?.name || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {userProfile?.email || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Member Since
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {userProfile?.memberSince || "N/A"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {mockStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <RecentActivities />
      </div>
    </>
  );
}
