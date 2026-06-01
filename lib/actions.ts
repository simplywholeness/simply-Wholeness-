"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { todayIso, weekStartIso } from "@/lib/date";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, userId: user.id };
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  return Number(formData.get(key) ?? 0);
}

export async function saveDailyCheckIn(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("daily_check_ins").upsert(
    {
      user_id: userId,
      check_in_date: todayIso(),
      mind: text(formData, "mind"),
      body: text(formData, "body"),
      spirit: text(formData, "spirit"),
      integration: text(formData, "integration")
    },
    { onConflict: "user_id,check_in_date" }
  );

  revalidatePath("/client");
}

export async function saveRoutine(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const routine = ["prayer", "scripture", "movement", "water", "intention"];

  await Promise.all(
    routine.map((item) =>
      supabase.from("morning_routine").upsert(
        {
          user_id: userId,
          completed_on: todayIso(),
          item_key: item,
          completed: formData.get(item) === "on"
        },
        { onConflict: "user_id,completed_on,item_key" }
      )
    )
  );

  revalidatePath("/client");
}

export async function addHabit(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("habits").insert({
    user_id: userId,
    title: text(formData, "title"),
    category: text(formData, "category") || "mind"
  });

  revalidatePath("/client");
}

export async function saveHabitCompletions(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const habitIds = formData.getAll("habit_id").map(String);

  await Promise.all(
    habitIds.map((habitId) =>
      supabase.from("habit_completions").upsert(
        {
          user_id: userId,
          habit_id: habitId,
          completed_on: todayIso(),
          completed: formData.get(`habit_${habitId}`) === "on"
        },
        { onConflict: "habit_id,completed_on" }
      )
    )
  );

  revalidatePath("/client");
}

export async function saveWeeklyReflection(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("weekly_reflections").upsert(
    {
      user_id: userId,
      week_start: weekStartIso(),
      wins: text(formData, "wins"),
      challenges: text(formData, "challenges"),
      energy: numberValue(formData, "energy"),
      stress: numberValue(formData, "stress"),
      lessons_learned: text(formData, "lessons_learned"),
      focus_next_week: text(formData, "focus_next_week")
    },
    { onConflict: "user_id,week_start" }
  );

  revalidatePath("/client");
}

export async function addGoal(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("goals").insert({
    user_id: userId,
    title: text(formData, "title"),
    why: text(formData, "why"),
    target_date: text(formData, "target_date") || null,
    status: "in_progress"
  });

  revalidatePath("/client");
}

export async function updateGoalStatus(formData: FormData) {
  const { supabase } = await getUserId();

  await supabase
    .from("goals")
    .update({ status: text(formData, "status") })
    .eq("id", text(formData, "goal_id"));

  revalidatePath("/client");
}

export async function addJournalEntry(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("journal_entries").insert({
    user_id: userId,
    title: text(formData, "title"),
    body: text(formData, "body")
  });

  revalidatePath("/client");
}

export async function addEncouragement(formData: FormData) {
  const { supabase, userId } = await getUserId();

  await supabase.from("encouragement_comments").insert({
    coach_id: userId,
    client_id: text(formData, "client_id"),
    body: text(formData, "body")
  });

  revalidatePath("/coach");
}
