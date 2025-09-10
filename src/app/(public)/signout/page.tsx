import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Adapted from shadcn/ui Blocks: Authentication > Logout confirmation
export default function SignOut() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Signed Out</CardTitle>
          <CardDescription>
            You have been successfully signed out (mock)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/signin">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}