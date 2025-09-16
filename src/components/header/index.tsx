import Link from "next/link";
import { getUserProfile } from "@/shared/libs/dal";
import { MobileMenu } from "./mobile-menu";
import { SearchInput } from "./search-input";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  children: React.ReactNode;
}

export async function Header({ children }: HeaderProps) {
  const userProfile = await getUserProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MobileMenu>
              {children}
            </MobileMenu>

            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="font-bold text-lg sm:text-xl">
                Secure Dashboard
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SearchInput />
            <UserMenu user={userProfile} />
          </div>
        </div>
      </div>
    </header>
  );
}
