"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/Button";

export function SignOutButton({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={signOut} aria-label="Sign out">
      {children}
    </Button>
  );
}
