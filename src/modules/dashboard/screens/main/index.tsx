import * as Sentry from "@sentry/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifySession } from "@/shared/libs/dal";
import { RecentActivities } from "@/modules/dashboard/components/recent-activities";
import { SentryErrorTest } from "@/components/sentry-error-test";
import { serverAuthFetch } from "@/modules/auth/utils/server-auth-fetch";

interface UserProfile {
  name: string | null;
  email: string | null;
  memberSince: string | null;
}

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await serverAuthFetch("/api/user-profile");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name || null,
      email: data.email || null,
      memberSince: data.memberSince || null,
    };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

export async function DashboardScreen() {
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
        <div>
          <SentryErrorTest />
        </div>
      </div>
    </>
  );
}
