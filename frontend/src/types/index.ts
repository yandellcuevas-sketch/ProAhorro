/**
 * ProAhorro — Tipos TypeScript centrales
 */

// ─── Usuario ────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  auth_provider: 'email' | 'apple' | 'google';
  provider_uid?: string;
  avatar_url?: string;
  main_currency: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ─── Moneda ──────────────────────────────────────────────────────────────────
export interface Currency {
  id: string;
  user_id?: string;
  code: string;     // 'DOP', 'USD', 'EUR'
  name: string;     // 'Peso Dominicano'
  symbol: string;   // 'RD$'
  exchange_rate: number; // relativo a USD
  is_default: boolean;
  is_system: boolean;
  created_at: string;
}

// ─── Meta ────────────────────────────────────────────────────────────────────
export type GoalStatus = 'active' | 'paused' | 'completed' | 'deleted';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  deadline?: string;
  status: GoalStatus;
  icon?: string;
  color?: string;
  progress_pct: number; // 0-100
  created_at: string;
  updated_at: string;
}

// ─── Lote de ahorro ──────────────────────────────────────────────────────────
export interface SavingBatch {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  date: string;
  method: SavingMethod;
  note?: string;
  created_at: string;
}

// ─── Ahorro individual ────────────────────────────────────────────────────────
export type SavingType = 'free' | 'goal' | 'split';
export type SavingMethod = 'cash' | 'transfer' | 'card' | 'digital' | 'other';

export interface Saving {
  id: string;
  user_id: string;
  batch_id?: string;
  amount: number;
  currency: string;
  date: string;
  type: SavingType;
  goal_id?: string;
  method: SavingMethod;
  note?: string;
  created_at: string;
  updated_at: string;
  // Relaciones populadas
  goal?: Pick<Goal, 'id' | 'name' | 'icon' | 'color'>;
  batch?: Pick<SavingBatch, 'id' | 'total_amount'>;
}

// ─── Configuración ───────────────────────────────────────────────────────────
export interface Settings {
  id: string;
  user_id: string;
  main_currency: string;
  theme: 'light' | 'dark' | 'system';
  pin_enabled: boolean;
  biometric_enabled: boolean;
  notifications_enabled: boolean;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardSummary {
  total_by_currency: Array<{
    currency: string;
    symbol: string;
    total: number;
  }>;
  monthly_saving: number;
  weekly_average: number;
  active_goals: number;
  recent_savings: Saving[];
  active_goals_list: Goal[];
}

// ─── Repartición ─────────────────────────────────────────────────────────────
export interface SplitItem {
  goal_id: string;
  goal_name: string;
  goal_icon?: string;
  goal_color?: string;
  amount: number;
}

export interface SplitPayload {
  total_amount: number;
  currency: string;
  date: string;
  method: SavingMethod;
  note?: string;
  splits: SplitItem[];
  leftover_as_free: boolean;
  leftover_amount: number;
}

// ─── Gráficos ────────────────────────────────────────────────────────────────
export interface MonthlyChartData {
  month: string;     // '2024-01'
  label: string;     // 'Ene'
  total: number;
  currency: string;
}

export interface GoalDistribution {
  goal_id: string;
  goal_name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ChartsData {
  monthly: MonthlyChartData[];
  by_currency: Array<{ currency: string; symbol: string; total: number; percentage: number }>;
  goal_distribution: GoalDistribution[];
  growth_line: Array<{ date: string; cumulative: number }>;
  free_vs_goals: { free: number; goals: number };
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthSession {
  user_id: string;
  email: string;
  name: string;
  access_token: string;
  expires_at: number;
}

// ─── Forms ───────────────────────────────────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AddSavingForm {
  amount: string;
  currency: string;
  date: string;
  method: SavingMethod;
  note: string;
  destination: 'free' | 'goal' | 'new_goal' | 'split';
  goal_id?: string;
}

export interface CreateGoalForm {
  name: string;
  description: string;
  target_amount: string;
  currency: string;
  deadline?: string;
  icon: string;
  color: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// ─── Navegación ──────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Dashboard: undefined;
  Ahorros: undefined;
  Metas: undefined;
  Historial: undefined;
  Cuenta: undefined;
};
