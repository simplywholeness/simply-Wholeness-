"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"client" | "coach">("client");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) setMessage(error.message);
      else setMessage("Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8 lg:grid lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-cream px-3 py-2 text-sm font-medium text-cocoa shadow-soft">
            <Leaf size={16} aria-hidden="true" />
            Faith-rooted holistic coaching
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl">
              Simply Wholeness
            </h1>
            <p className="max-w-xl text-base leading-7 text-cocoa">
              A calm coaching space for daily alignment, embodied habits, honest reflection, and steady personal growth.
            </p>
          </div>
          <div className="grid max-w-xl grid-cols-2 gap-3 text-sm text-cocoa">
            {["Mind", "Body", "Spirit", "Integration"].map((item) => (
              <div key={item} className="rounded-md border border-oat bg-cream/70 px-3 py-3">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <div className="mb-5 grid grid-cols-2 rounded-md bg-linen p-1">
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-cream text-ink shadow-sm" : "text-cocoa"}`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`rounded px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-cream text-ink shadow-sm" : "text-cocoa"}`}
              onClick={() => setMode("signup")}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" ? (
              <>
                <label className="block space-y-2">
                  <span className="label">Full name</span>
                  <input className="field" value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label className="block space-y-2">
                  <span className="label">Role</span>
                  <select className="field" value={role} onChange={(event) => setRole(event.target.value as "client" | "coach")}>
                    <option value="client">Client</option>
                    <option value="coach">Coach</option>
                  </select>
                </label>
              </>
            ) : null}
            <label className="block space-y-2">
              <span className="label">Email</span>
              <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block space-y-2">
              <span className="label">Password</span>
              <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </label>
            {message ? <p className="rounded-md bg-linen px-3 py-2 text-sm text-cocoa">{message}</p> : null}
            <Button className="w-full" disabled={loading}>
              {loading ? "Please wait" : mode === "signin" ? "Enter dashboard" : "Create account"}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
