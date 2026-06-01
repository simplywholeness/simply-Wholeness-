import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Profile } from "@/lib/types";
import { SignOutButton } from "@/components/SignOutButton";

type AppShellProps = {
  profile: Profile;
  children: ReactNode;
};

export function AppShell({ profile, children }: AppShellProps) {
  const base = profile.role === "coach" ? "/coach" : "/client";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-oat/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={base} className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-ink text-cream">
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight text-ink">Simply Wholeness</span>
              <span className="block text-xs capitalize text-cocoa">{profile.role}</span>
            </span>
          </Link>
          <SignOutButton>
            <LogOut size={16} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Sign out</span>
          </SignOutButton>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
