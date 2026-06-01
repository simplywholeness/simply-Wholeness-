import { redirect } from "next/navigation";
import { MessageCircle, NotebookText, Percent, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { addEncouragement } from "@/lib/actions";
import { getSessionProfile } from "@/lib/auth";
import { formatDate, todayIso, weekStartIso } from "@/lib/date";

export default async function CoachDashboard() {
  const { supabase, profile } = await getSessionProfile();
  if (profile.role !== "coach") redirect("/client");

  const today = todayIso();
  const weekStart = weekStartIso();

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("full_name", { ascending: true });

  const clientIds = (clients ?? []).map((client: any) => client.id);

  const [{ data: checkIns }, { data: habits }, { data: completions }, { data: reflections }] = await Promise.all([
    supabase.from("daily_check_ins").select("*").in("user_id", clientIds.length ? clientIds : ["00000000-0000-0000-0000-000000000000"]).order("check_in_date", { ascending: false }),
    supabase.from("habits").select("*").in("user_id", clientIds.length ? clientIds : ["00000000-0000-0000-0000-000000000000"]).eq("active", true),
    supabase.from("habit_completions").select("*").in("user_id", clientIds.length ? clientIds : ["00000000-0000-0000-0000-000000000000"]).gte("completed_on", weekStart),
    supabase.from("weekly_reflections").select("*").in("user_id", clientIds.length ? clientIds : ["00000000-0000-0000-0000-000000000000"]).order("week_start", { ascending: false })
  ]);

  const checkInsToday = (checkIns ?? []).filter((item: any) => item.check_in_date === today).length;
  const habitTotal = (habits ?? []).length * 7;
  const habitDone = (completions ?? []).filter((item: any) => item.completed).length;
  const habitPercent = habitTotal ? Math.round((habitDone / habitTotal) * 100) : 0;
  const reflectionsThisWeek = (reflections ?? []).filter((item: any) => item.week_start === weekStart).length;

  return (
    <AppShell profile={profile}>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Coach dashboard"
          title="Client care overview"
          description="Review client rhythms, reflections, and habit progress, then leave encouragement that keeps the work personal."
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Clients" value={`${clients?.length ?? 0}`} detail="Visible in your practice" icon={<Users size={18} />} />
          <MetricCard label="Check-ins today" value={`${checkInsToday}`} detail={formatDate(today)} icon={<NotebookText size={18} />} />
          <MetricCard label="Habit completion" value={`${habitPercent}%`} detail="Across this week" icon={<Percent size={18} />} />
          <MetricCard label="Reflections" value={`${reflectionsThisWeek}`} detail="Submitted this week" icon={<MessageCircle size={18} />} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="panel p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-semibold text-ink">All clients</h2>
            <div className="space-y-3">
              {(clients ?? []).map((client: any) => {
                const clientHabits = (habits ?? []).filter((habit: any) => habit.user_id === client.id);
                const clientDone = (completions ?? []).filter((item: any) => item.user_id === client.id && item.completed).length;
                const clientTotal = clientHabits.length * 7;
                const clientPercent = clientTotal ? Math.round((clientDone / clientTotal) * 100) : 0;
                return (
                  <a key={client.id} href={`#client-${client.id}`} className="block rounded-md border border-oat bg-cream p-3 transition hover:border-clay">
                    <p className="font-medium text-ink">{client.full_name}</p>
                    <p className="mt-1 text-xs text-cocoa">{clientPercent}% habits this week</p>
                  </a>
                );
              })}
              {!clients?.length ? <p className="text-sm text-cocoa">No clients yet. Assign client profiles to this coach in Supabase.</p> : null}
            </div>
          </div>

          <div className="space-y-5">
            {(clients ?? []).map((client: any) => {
              const latestCheckIn = (checkIns ?? []).find((item: any) => item.user_id === client.id);
              const latestReflection = (reflections ?? []).find((item: any) => item.user_id === client.id);
              const clientHabits = (habits ?? []).filter((habit: any) => habit.user_id === client.id);
              const clientDone = (completions ?? []).filter((item: any) => item.user_id === client.id && item.completed).length;
              const clientTotal = clientHabits.length * 7;
              const clientPercent = clientTotal ? Math.round((clientDone / clientTotal) * 100) : 0;

              return (
                <article id={`client-${client.id}`} key={client.id} className="panel p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-ink">{client.full_name}</h2>
                      <p className="text-sm text-cocoa">{client.email ?? "Client profile"}</p>
                    </div>
                    <span className="rounded-md bg-linen px-3 py-2 text-sm font-semibold text-cocoa">{clientPercent}% habits</span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-md border border-oat bg-cream p-3">
                      <p className="label">Latest check-in</p>
                      {latestCheckIn ? (
                        <div className="mt-3 space-y-3 text-sm leading-6 text-cocoa">
                          {["mind", "body", "spirit", "integration"].map((key) => (
                            <p key={key}>
                              <span className="font-semibold capitalize text-ink">{key}: </span>
                              {latestCheckIn[key] || "No note"}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-cocoa">No check-in yet.</p>
                      )}
                    </div>

                    <div className="rounded-md border border-oat bg-cream p-3">
                      <p className="label">Weekly reflection</p>
                      {latestReflection ? (
                        <div className="mt-3 space-y-3 text-sm leading-6 text-cocoa">
                          <p><span className="font-semibold text-ink">Wins: </span>{latestReflection.wins || "No note"}</p>
                          <p><span className="font-semibold text-ink">Challenges: </span>{latestReflection.challenges || "No note"}</p>
                          <p><span className="font-semibold text-ink">Energy: </span>{latestReflection.energy}/10</p>
                          <p><span className="font-semibold text-ink">Stress: </span>{latestReflection.stress}/10</p>
                          <p><span className="font-semibold text-ink">Next focus: </span>{latestReflection.focus_next_week || "No note"}</p>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-cocoa">No reflection yet.</p>
                      )}
                    </div>
                  </div>

                  <form action={addEncouragement} className="mt-4">
                    <input type="hidden" name="client_id" value={client.id} />
                    <label className="block space-y-2">
                      <span className="label">Encouragement comment</span>
                      <textarea name="body" className="field min-h-24 resize-y" placeholder="Leave a note that affirms, guides, or gently redirects." required />
                    </label>
                    <Button className="mt-3 w-full sm:w-auto">Leave comment</Button>
                  </form>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
