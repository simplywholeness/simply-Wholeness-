import { redirect } from "next/navigation";
import { BookOpen, CalendarCheck, HeartPulse, ListChecks, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getSessionProfile } from "@/lib/auth";
import { todayIso, weekStartIso, formatDate } from "@/lib/date";
import {
  addGoal,
  addHabit,
  addJournalEntry,
  saveDailyCheckIn,
  saveHabitCompletions,
  saveRoutine,
  saveWeeklyReflection,
  updateGoalStatus
} from "@/lib/actions";

const checkInFields = [
  ["mind", "Mind"],
  ["body", "Body"],
  ["spirit", "Spirit"],
  ["integration", "Integration"]
];

const routineItems = [
  ["prayer", "Prayer"],
  ["scripture", "Scripture"],
  ["movement", "Gentle movement"],
  ["water", "Water"],
  ["intention", "Intention"]
];

export default async function ClientDashboard() {
  const { supabase, profile } = await getSessionProfile();
  if (profile.role !== "client") redirect("/coach");

  const today = todayIso();
  const weekStart = weekStartIso();

  const [
    { data: checkIn },
    { data: habits },
    { data: completions },
    { data: routine },
    { data: reflection },
    { data: goals },
    { data: journal },
    { data: comments }
  ] = await Promise.all([
    supabase.from("daily_check_ins").select("*").eq("user_id", profile.id).eq("check_in_date", today).maybeSingle(),
    supabase.from("habits").select("*").eq("user_id", profile.id).eq("active", true).order("created_at", { ascending: true }),
    supabase.from("habit_completions").select("*").eq("user_id", profile.id).eq("completed_on", today),
    supabase.from("morning_routine").select("*").eq("user_id", profile.id).eq("completed_on", today),
    supabase.from("weekly_reflections").select("*").eq("user_id", profile.id).eq("week_start", weekStart).maybeSingle(),
    supabase.from("goals").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("journal_entries").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(3),
    supabase.from("encouragement_comments").select("*, coach:profiles!encouragement_comments_coach_id_fkey(full_name)").eq("client_id", profile.id).order("created_at", { ascending: false }).limit(3)
  ]);

  const completedHabits = (completions ?? []).filter((item: any) => item.completed).length;
  const habitPercent = habits?.length ? Math.round((completedHabits / habits.length) * 100) : 0;
  const completedRoutine = (routine ?? []).filter((item: any) => item.completed).length;
  const openGoals = (goals ?? []).filter((goal: any) => goal.status !== "complete").length;

  return (
    <AppShell profile={profile}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow={formatDate(today)}
          title={`Welcome back, ${profile.full_name.split(" ")[0] || "friend"}`}
          description="A grounded place to notice what is true, practice what matters, and keep becoming whole."
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Habits today" value={`${habitPercent}%`} detail={`${completedHabits} of ${habits?.length ?? 0} complete`} icon={<TrendingUp size={18} />} />
          <MetricCard label="Routine" value={`${completedRoutine}/5`} detail="Morning checklist" icon={<CalendarCheck size={18} />} />
          <MetricCard label="Open goals" value={`${openGoals}`} detail="In active formation" icon={<Target size={18} />} />
          <MetricCard label="Check-in" value={checkIn ? "Done" : "Open"} detail="Mind, body, spirit, integration" icon={<HeartPulse size={18} />} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <form action={saveDailyCheckIn} className="panel p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <HeartPulse size={18} className="text-clay" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-ink">Daily check-in</h2>
            </div>
            <div className="space-y-3">
              {checkInFields.map(([key, label]) => (
                <label key={key} className="block space-y-2">
                  <span className="label">{label}</span>
                  <textarea name={key} className="field min-h-24 resize-y" defaultValue={checkIn?.[key] ?? ""} placeholder={`What are you noticing in your ${label.toLowerCase()}?`} />
                </label>
              ))}
            </div>
            <Button className="mt-4 w-full sm:w-auto">Save check-in</Button>
          </form>

          <div className="space-y-5">
            <form action={saveRoutine} className="panel p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks size={18} className="text-clay" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-ink">Morning routine</h2>
              </div>
              <div className="space-y-2">
                {routineItems.map(([key, label]) => {
                  const isDone = (routine ?? []).some((item: any) => item.item_key === key && item.completed);
                  return (
                    <label key={key} className="flex items-center gap-3 rounded-md border border-oat bg-cream px-3 py-3 text-sm text-ink">
                      <input name={key} type="checkbox" defaultChecked={isDone} className="size-4 accent-clay" />
                      {label}
                    </label>
                  );
                })}
              </div>
              <Button className="mt-4 w-full" variant="secondary">Update routine</Button>
            </form>

            <form action={saveHabitCompletions} className="panel p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <CalendarCheck size={18} className="text-clay" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-ink">Habit tracker</h2>
              </div>
              <div className="space-y-2">
                {(habits ?? []).map((habit: any) => {
                  const isDone = (completions ?? []).some((item: any) => item.habit_id === habit.id && item.completed);
                  return (
                    <label key={habit.id} className="flex items-center gap-3 rounded-md border border-oat bg-cream px-3 py-3 text-sm text-ink">
                      <input type="hidden" name="habit_id" value={habit.id} />
                      <input name={`habit_${habit.id}`} type="checkbox" defaultChecked={isDone} className="size-4 accent-clay" />
                      <span className="flex-1">{habit.title}</span>
                      <span className="text-xs capitalize text-cocoa">{habit.category}</span>
                    </label>
                  );
                })}
                {!habits?.length ? <p className="text-sm text-cocoa">Add your first habit below.</p> : null}
              </div>
              <Button className="mt-4 w-full" variant="secondary">Save habits</Button>
            </form>

            <form action={addHabit} className="panel p-4 sm:p-5">
              <h2 className="mb-4 text-lg font-semibold text-ink">Add habit</h2>
              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                <input name="title" className="field" placeholder="Evening walk" required />
                <select name="category" className="field">
                  <option value="mind">Mind</option>
                  <option value="body">Body</option>
                  <option value="spirit">Spirit</option>
                  <option value="integration">Integration</option>
                </select>
              </div>
              <Button className="mt-4 w-full" variant="secondary">Add habit</Button>
            </form>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <form action={saveWeeklyReflection} className="panel p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-clay" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-ink">Weekly reflection</h2>
            </div>
            <div className="space-y-3">
              {[
                ["wins", "Wins"],
                ["challenges", "Challenges"],
                ["lessons_learned", "Lessons learned"],
                ["focus_next_week", "Focus for next week"]
              ].map(([key, label]) => (
                <label key={key} className="block space-y-2">
                  <span className="label">{label}</span>
                  <textarea name={key} className="field min-h-20 resize-y" defaultValue={reflection?.[key] ?? ""} />
                </label>
              ))}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="label">Energy</span>
                  <input name="energy" type="range" min="1" max="10" defaultValue={reflection?.energy ?? 5} className="w-full accent-clay" />
                </label>
                <label className="block space-y-2">
                  <span className="label">Stress</span>
                  <input name="stress" type="range" min="1" max="10" defaultValue={reflection?.stress ?? 5} className="w-full accent-clay" />
                </label>
              </div>
            </div>
            <Button className="mt-4 w-full sm:w-auto">Save reflection</Button>
          </form>

          <div className="space-y-5">
            <form action={addGoal} className="panel p-4 sm:p-5">
              <h2 className="mb-4 text-lg font-semibold text-ink">Goal tracking</h2>
              <div className="space-y-3">
                <input name="title" className="field" placeholder="Goal" required />
                <textarea name="why" className="field min-h-20 resize-y" placeholder="Why this matters" />
                <input name="target_date" type="date" className="field" />
              </div>
              <Button className="mt-4 w-full" variant="secondary">Add goal</Button>
            </form>

            <div className="panel p-4 sm:p-5">
              <h2 className="mb-4 text-lg font-semibold text-ink">Active goals</h2>
              <div className="space-y-3">
                {(goals ?? []).slice(0, 4).map((goal: any) => (
                  <form key={goal.id} action={updateGoalStatus} className="rounded-md border border-oat bg-cream p-3">
                    <input type="hidden" name="goal_id" value={goal.id} />
                    <p className="font-medium text-ink">{goal.title}</p>
                    {goal.why ? <p className="mt-1 text-sm text-cocoa">{goal.why}</p> : null}
                    <div className="mt-3 flex gap-2">
                      <select name="status" defaultValue={goal.status} className="field py-2">
                        <option value="not_started">Not started</option>
                        <option value="in_progress">In progress</option>
                        <option value="complete">Complete</option>
                      </select>
                      <Button variant="secondary">Update</Button>
                    </div>
                  </form>
                ))}
                {!goals?.length ? <p className="text-sm text-cocoa">No goals yet.</p> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <form action={addJournalEntry} className="panel p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-semibold text-ink">Journal</h2>
            <div className="space-y-3">
              <input name="title" className="field" placeholder="Entry title" required />
              <textarea name="body" className="field min-h-32 resize-y" placeholder="Write what you need to name today." required />
            </div>
            <Button className="mt-4 w-full sm:w-auto">Save entry</Button>
          </form>

          <div className="panel p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-semibold text-ink">Encouragement</h2>
            <div className="space-y-3">
              {(comments ?? []).map((comment: any) => (
                <article key={comment.id} className="rounded-md border border-oat bg-cream p-3">
                  <p className="text-sm leading-6 text-ink">{comment.body}</p>
                  <p className="mt-2 text-xs text-cocoa">{comment.coach?.full_name ?? "Coach"}</p>
                </article>
              ))}
              {!comments?.length ? <p className="text-sm text-cocoa">Coach comments will appear here.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
