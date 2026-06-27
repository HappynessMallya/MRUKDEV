import Link from "next/link";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Separator } from "@/components/ui/separator";
import type { Role } from "@/types/auth";
import type { AppNotification } from "@/types/notification";

interface AppTopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
  notifications?: AppNotification[];
}

export function AppTopbar({ user, notifications }: AppTopbarProps) {
  return (
    <header className="bg-card/80 sticky top-0 z-30 flex h-topbar items-center gap-2 border-b px-4 backdrop-blur-sm sm:px-6">
      <MobileNav role={user.role} />
      <Link href="/" className="text-base font-bold tracking-tight lg:hidden">
        MRUK
      </Link>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <NotificationsBell notifications={notifications} />
        <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />
        <UserMenu
          name={user.name}
          email={user.email}
          image={user.image}
          role={user.role}
        />
      </div>
    </header>
  );
}
