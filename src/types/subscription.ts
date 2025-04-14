// types/subscription.ts
export interface Customer {
  customer_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  subscription_id: string;
  subscription_status: SubscriptionStatus;
  price_id: string;
  product_id: string;
  scheduled_change: string | null;
  customer_id?: string;
  created_at: string;
  updated_at: string;

  // New billing cycle fields
  next_billed_at: string | null;
  billing_frequency: number | null;
  billing_interval: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "paused"
  | "canceled"
  | "past_due"
  | "unpaid"
  | string;

export interface PlanDetails {
  name: string;
  price: string;
  features: string[];
}

export const PRICE_MAP: Record<string, PlanDetails> = {
  pri_01jrnh4z3hmr6zm4e6tf8fxg4x: {
    name: "Basic",
    price: "$9.9/month",
    features: [
      "Process up to 500 documents/month",
      "All core features included",
      "Template creation",
      "Export to CSV/Excel",
    ],
  },
  pri_01jrnh5sqd8kqmfe6jzf0sd6n0: {
    name: "Professional",
    price: "$19.9/month",
    features: [
      "Process up to 1500 documents/month",
      "All core features included",
      "Advanced template management",
      "Priority customer support",
    ],
  },
};
