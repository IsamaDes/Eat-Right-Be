/* ============================================================================
   Client Analytics API Contract
   ============================================================================
   Purpose:
   - Power client analytics (trends + insights)
   - Deterministic, explainable, frontend-friendly
   - No frontend guessing or derived math
============================================================================ */

/* =============================== Query =============================== */

export type AnalyticsRange = '7d' | '30d';

export type ClientAnalyticsQuery = {
  range: AnalyticsRange;
  timezone?: string; // e.g. "Africa/Lagos"
  include?: Array<'weight' | 'mood' | 'insights'>;
};

/* =============================== Meta =============================== */

export type AnalyticsMeta = {
  range: AnalyticsRange;
  startDate: string; // ISO
  endDate: string;   // ISO
  comparison?: {
    previousRangeStart: string;
    previousRangeEnd: string;
  };
};

/* =============================== Summary =============================== */

export type AnalyticsSummary = {
  adherenceRate: number;  // 0–100
  avgCalories: number;
  calorieDelta?: number;  // vs previous period (+/-)
  streak: number;         // consecutive days
};

/* =============================== Trends =============================== */

/* ---- Calories ---- */
export type CalorieTrendPoint = {
  date: string; // ISO date
  consumedCalories: number;
  targetCalories: number;
};

export type CalorieTrend = {
  daily: CalorieTrendPoint[];
};

/* ---- Weight (Optional) ---- */
export type WeightTrendPoint = {
  date: string;
  weight: number; // kg
};

export type WeightTrend = {
  weeklyAverage: WeightTrendPoint[];
};

/* ---- Mood / Energy (Optional) ---- */
export type MoodTrendPoint = {
  date: string;
  energyScore: number; // 1–5
  moodScore: number;   // 1–5
};

/* ---- Trends Wrapper ---- */
export type AnalyticsTrends = {
  calories: CalorieTrend;
  weight?: WeightTrend;
  mood?: MoodTrendPoint[];
};

/* =============================== Insights =============================== */

export type InsightType = 'positive' | 'warning' | 'neutral';

export type Insight = {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  recommendation?: string;
  confidence?: number; // 0–1
};

/* =============================== Response =============================== */

export type ClientAnalyticsResponse = {
  meta: AnalyticsMeta;
  summary: AnalyticsSummary;
  trends: AnalyticsTrends;
  insights?: Insight[];
};
