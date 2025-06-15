
export const determinePlanType = (paymentAmount: number, serviceName?: string): string => {
  let planType = 'premium'; // Default to premium for paid subscriptions
  
  if (serviceName) {
    const serviceLower = serviceName.toLowerCase();
    if (serviceLower.includes('базовый') || serviceLower.includes('basic')) {
      planType = 'basic';
    } else if (serviceLower.includes('стандарт') || serviceLower.includes('standard')) {
      planType = 'standard';
    } else if (serviceLower.includes('премиум') || serviceLower.includes('premium')) {
      planType = 'premium';
    }
  } else {
    // Determine by amount (adjust these values based on your pricing)
    if (paymentAmount >= 4000) {
      planType = 'premium';
    } else if (paymentAmount >= 2000) {
      planType = 'standard';
    } else if (paymentAmount >= 1000) {
      planType = 'basic';
    }
  }

  return planType;
};

export const calculateExpirationDate = (paymentDateStr?: string): Date => {
  let expiresAt: Date;
  
  if (paymentDateStr) {
    // Parse payment date and add 30 days
    const paymentDateParsed = new Date(paymentDateStr);
    if (!isNaN(paymentDateParsed.getTime())) {
      expiresAt = new Date(paymentDateParsed);
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      console.warn('Invalid payment date format:', paymentDateStr, 'using current date');
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    }
  } else {
    // If no payment date provided, use current date + 30 days
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
  }

  return expiresAt;
};

export const createSubscription = async (
  supabase: any,
  userId: string,
  planType: string,
  expiresAt: Date,
  paymentDateStr?: string
) => {
  // Cancel any existing active subscription
  const { error: cancelError } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (cancelError) {
    console.error('Error canceling existing subscription:', cancelError);
  }

  // Create new subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      expires_at: expiresAt.toISOString(),
      started_at: paymentDateStr ? new Date(paymentDateStr).toISOString() : new Date().toISOString(),
    })
    .select()
    .single();

  if (subscriptionError) {
    console.error('Error creating subscription:', subscriptionError);
    throw subscriptionError;
  }

  console.log('Subscription created successfully:', subscription);
  return subscription;
};
