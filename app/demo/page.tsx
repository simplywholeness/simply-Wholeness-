"use client";

import { useState } from "react";
import { BookOpen, CalendarCheck, HeartPulse, ListChecks, MessageCircle, Percent, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";

const checkInFields = ["Mind", "Body", "Spirit", "Integration"];
const routineItems = ["Prayer", "Scripture", "Gentle movement", "Water", "Intention"];
const habitItems = [
  ["Morning prayer", "Spirit"],
  ["Protein breakfast", "Body"],
  ["Thought reset", "Mind"],
  ["Evening walk", "Body"],
  ["Journal reflection", "Integration"]
];

export default function DemoPage() {
  const [role, setRole] = useState<"client" | "coach">("client");
  const [toast, setToast] = useState("");
  const [checkInDone, setCheckInDone] = useState(false);

  function save(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1700);
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-oat/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-ink text-cream">
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight text-ink">Simply Wholeness</span>
              <span className="block text-xs capitalize text-cocoa">{role} demo</span>
            </span>
          </div>
          <Button variant="secondary" onClick={() => setRole(role === "client" ? "coach" : "client")}>
            {role === "client" ? "Coach view" : "Client view"}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-8">
        {role === "client" ? (
          <>
            <SectionHeader
              eyebrow="Demo mode"
              title="Welcome back, Hadassah"
              description="This is a clickable local demo. Add Supabase keys later to enable real accounts and saved database records."
            />

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Habits today" value="60%" detail="3 of 5 complete" icon={<CalendarCheck size={18} />} />
              <MetricCard label="Routine" value="3/5" detail="Morning checklist" icon={<ListChecks size={18} />} />
              <MetricCard label="Open goals" value="2" detail="In active formation" icon={<Target size={18} />} />
              <MetricCard label="Check-in" value={checkInDone ? "Done" : "Open"} detail="Mind, body, spirit, integration" icon={<HeartPulse size={18} />} />
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <form
                className="panel p-4 sm:p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setCheckInDone(true);
                  save("Daily check-in saved");
                }}
              >
                <h2 className="mb-4 text-lg font-semibold text-ink">Daily check-in</h2>
                <div className="space-y-3">
                  {checkInFields.map((label) => (
                    <label key={label} className="block space-y-2">
                      <span className="label">{label}</span>
                      <textarea className="field min-h-24 resize-y" placeholder={`What are you noticing in your ${label.toLowerCase()}?`} />
                    </label>
                  ))}
                </div>
                <Button className="mt-4 w-full sm:w-auto">Save check-in</Button>
              </form>

              <div className="space-y-5">
                <form
                  className="panel p-4 sm:p-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    save("Morning routine updated");
                  }}
                >
                  <h2 className="mb-4 text-lg font-semibold text-ink">Morning routine</h2>
                  <div className="space-y-2">
                    {routineItems.map((item, index) => (
                      <label key={item} className="flex items-center gap-3 rounded-md border border-oat bg-cream px-3 py-3 text-sm text-ink">
                        <input type="checkbox" defaultChecked={index < 3} className="size-4 accent-clay" />
                        {item}
                      </label>
                    ))}
                  </div>
                  <Button className="mt-4 w-full" variant="secondary">Update routine</Button>
                </form>

                <form
                  className="panel p-4 sm:p-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    save("Habits saved");
                  }}
                >
                  <h2 className="mb-4 text-lg font-semibold text-ink">Habit tracker</h2>
                  <div className="space-y-2">
                    {habitItems.map(([title, category], index) => (
                      <label key={title} className="flex items-center gap-3 rounded-md border border-oat bg-cream px-3 py-3 text-sm text-ink">
                        <input type="checkbox" defaultChecked={index < 3} className="size-4 accent-clay" />
                        <span className="flex-1">{title}</span>
                        <span className="text-xs text-cocoa">{category}</span>
                      </label>
                    ))}
                  </div>
                  <Button className="mt-4 w-full" variant="secondary">Save habits</Button>
                </form>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <form
                className="panel p-4 sm:p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  save("Weekly reflection saved");
                }}
              >
                <h2 className="mb-4 text-lg font-semibold text-ink">Weekly reflection</h2>
                <div className="space-y-3">
                  {["Wins", "Challenges", "Lessons learned", "Focus for next week"].map((label) => (
                    <label key={label} className="block space-y-2">
                      <span className="label">{label}</span>
                      <textarea className="field min-h-20 resize-y" />
                    </label>
                  ))}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-2"><span className="label">Energy</span><input type="range" min="1" max="10" defaultValue="7" className="w-full accent-clay" /></label>
                    <label className="block space-y-2"><span className="label">Stress</span><input type="range" min="1" max="10" defaultValue="4" className="w-full accent-clay" /></label>
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto">Save reflection</Button>
              </form>

              <div className="space-y-5">
                <form className="panel p-4 sm:p-5" onSubmit={(event) => { event.preventDefault(); save("Goal added"); }}>
                  <h2 className="mb-4 text-lg font-semibold text-ink">Goal tracking</h2>
                  <div className="space-y-3">
                    <input className="field" placeholder="Goal" />
                    <textarea className="field min-h-20 resize-y" placeholder="Why this matters" />
                    <input type="date" className="field" />
                  </div>
                  <Button className="mt-4 w-full" variant="secondary">Add goal</Button>
                </form>

                <form className="panel p-4 sm:p-5" onSubmit={(event) => { event.preventDefault(); save("Journal entry saved"); }}>
                  <h2 className="mb-4 text-lg font-semibold text-ink">Journal</h2>
                  <div className="space-y-3">
                    <input className="field" placeholder="Entry title" />
                    <textarea className="field min-h-32 resize-y" placeholder="Write what you need to name today." />
                  </div>
                  <Button className="mt-4 w-full sm:w-auto">Save entry</Button>
                </form>
              </div>
            </section>
          </>
        ) : (
          <>
            <SectionHeader
              eyebrow="Coach dashboard"
              title="Client care overview"
              description="Review client rhythms, reflections, habit progress, and leave encouragement."
            />

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Clients" value="3" detail="Visible in your practice" icon={<Users size={18} />} />
              <MetricCard label="Check-ins today" value="2" detail="Submitted today" icon={<BookOpen size={18} />} />
              <MetricCard label="Habit completion" value="71%" detail="Across this week" icon={<Percent size={18} />} />
              <MetricCard label="Reflections" value="2" detail="Submitted this week" icon={<MessageCircle size={18} />} />
            </section>

            <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <aside className="panel p-4 sm:p-5">
                <h2 className="mb-4 text-lg font-semibold text-ink">All clients</h2>
                <div className="space-y-3">
                  {["Maya Thompson - 82%", "Janelle Price - 64%", "Erica Williams - 67%"].map((client) => (
                    <div key={client} className="rounded-md border border-oat bg-cream p-3 text-sm text-ink">{client}</div>
                  ))}
                </div>
              </aside>

              <article className="panel p-4 sm:p-5">
                <h2 className="text-xl font-semibold text-ink">Maya Thompson</h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-md border border-oat bg-cream p-3 text-sm leading-6 text-cocoa">
                    <p className="label">Latest check-in</p>
                    <p><span className="font-semibold text-ink">Mind: </span>Clearer after naming the fear.</p>
                    <p><span className="font-semibold text-ink">Body: </span>More energy with a slower morning.</p>
                    <p><span className="font-semibold text-ink">Spirit: </span>Feeling invited to trust the process.</p>
                  </div>
                  <div className="rounded-md border border-oat bg-cream p-3 text-sm leading-6 text-cocoa">
                    <p className="label">Weekly reflection</p>
                    <p><span className="font-semibold text-ink">Wins: </span>Kept the morning rhythm four days.</p>
                    <p><span className="font-semibold text-ink">Energy: </span>8/10</p>
                    <p><span className="font-semibold text-ink">Stress: </span>3/10</p>
                  </div>
                </div>
                <form className="mt-4" onSubmit={(event) => { event.preventDefault(); save("Encouragement sent"); }}>
                  <label className="block space-y-2">
                    <span className="label">Encouragement comment</span>
                    <textarea className="field min-h-24 resize-y" placeholder="Leave a note that affirms, guides, or gently redirects." />
                  </label>
                  <Button className="mt-3 w-full sm:w-auto">Leave comment</Button>
                </form>
              </article>
            </section>
          </>
        )}
      </div>

      {toast ? <div className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-md rounded-md bg-ink px-4 py-3 text-center text-sm font-semibold text-cream shadow-soft">{toast}</div> : null}
    </main>
  );
}
