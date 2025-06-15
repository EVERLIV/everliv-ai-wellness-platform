
// Re-export all admin service functionality from modular services
export { checkAdminAccess } from "./admin/admin-security";

export { 
  fetchAdminUsers, 
  updateUserProfile,
  type AdminUser 
} from "./admin/user-management";

export { 
  assignSubscriptionToUser,
  cancelUserSubscription 
} from "./admin/subscription-management";

export { 
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  type AdminSubscriptionPlan,
  type PlanFeatureDetail 
} from "./admin/subscription-plans";
