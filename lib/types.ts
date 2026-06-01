export type Role = "client" | "coach";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  coach_id: string | null;
};

export type DailyCheckIn = {
  id: string;
  user_id: string;
  check_in_date: string;
  mind: string;
  body: string;
  spirit: string;
  integration: string;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  category: "mind" | "body" | "spirit" | "integration";
  active: boolean;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_on: string;
  completed: boolean;
};

export type WeeklyReflection = {
  id: string;
  user_id: string;
  week_start: string;
  wins: string;
  challenges: string;
  energy: number;
  stress: number;
  lessons_learned: string;
  focus_next_week: string;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  why: string;
  target_date: string | null;
  status: "not_started" | "in_progress" | "complete";
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
};
