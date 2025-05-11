
export type SubscriptionPlan = 'basic' | 'standard' | 'premium';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  status: SubscriptionStatus;
  started_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureTrial {
  id: string;
  user_id: string;
  feature_name: string;
  used_at: string;
}

export interface PlanFeature {
  name: string;
  description: string;
  includedIn: {
    basic: boolean;
    standard: boolean;
    premium: boolean;
  };
}
