import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/shared/libs/dal";
import { DynamicRecentActivities } from "@/modules/dashboard/components/recent-activities/dynamic";
import { DynamicSentryErrorTest } from "@/components/sentry-error-test/dynamic";
import { CheckCircle, User } from "lucide-react";

export async function DashboardScreen() {
  const userProfile = await getUserProfile();

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome to your member area
          {userProfile?.name ? `, ${userProfile.name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here you can track your profile, activities and exclusive content.
        </p>
      </header>

      <section aria-labelledby="membership-status">
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full"
                aria-hidden="true"
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2
                    id="membership-status"
                    className="text-lg font-semibold text-green-900"
                  >
                    Active Member
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-green-700">
                  Your membership is active and all features are available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="profile-section">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User
                className="w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle id="profile-section">Your Profile</CardTitle>
            </div>
            <CardDescription>
              Your account information and membership details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            </dl>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <section className="lg:col-span-2" aria-labelledby="activity-section">
          <div className="mb-4">
            <h3
              id="activity-section"
              className="text-xl font-semibold text-foreground"
            >
              Your recent activity
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track your latest actions and events
            </p>
          </div>
          <DynamicRecentActivities />
        </section>
        <aside>
          <DynamicSentryErrorTest />
        </aside>
      </div>

      <section aria-labelledby="cta-section">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3
                id="cta-section"
                className="text-lg font-semibold text-blue-900 mb-2"
              >
                Ready to explore more?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Discover additional features and tools available in your member
                area
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Explore more features
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
