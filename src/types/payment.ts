export interface CreateSubscriptionInput {
  subscriberId: string;
  planName: string;
  amount: number;
  billingInterval: "daily" | "weekly" | "monthly" | "yearly";
  billingCycleCount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface InitializePaymentInput {
  redirectUrl: string;
  metadata?: Record<string, any>;
  reference?: string;
}
