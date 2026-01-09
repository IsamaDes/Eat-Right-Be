export interface CreateSubscriptionInput {
 userId: string;
  planName: string;
  amount: number;
  billingInterval: "daily" | "weekly" | "monthly" | "yearly";
  billingCycleCount: number;
  currency?: string;
  metadata?: Record<string, any>;
  gateway: string;
  reference?: string;
}


