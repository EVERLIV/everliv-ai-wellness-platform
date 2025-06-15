
import { WebhookData } from "./webhook-parser.ts";
import { findUserByEmail } from "./user-service.ts";
import { determinePlanType, calculateExpirationDate, createSubscription } from "./subscription-service.ts";

export const processPayment = async (supabase: any, webhookData: WebhookData) => {
  // Extract required payment data
  const {
    sum,
    amount,
    payerEmail,
    payer_email,
    email,
    paymentDate,
    payment_date,
    date,
    service_name,
    orderid,
    order_id,
    transaction_id,
    mdOrder,
    orderId
  } = webhookData;

  const paymentAmount = parseFloat(sum || amount || '0');
  const userEmail = payerEmail || payer_email || email;
  const paymentDateStr = paymentDate || payment_date || date;
  const orderId_final = orderid || order_id || transaction_id || mdOrder || orderId;

  console.log('Processing successful payment:', {
    email: userEmail,
    amount: paymentAmount,
    paymentDate: paymentDateStr,
    service_name,
    orderId: orderId_final
  });

  // Validate required fields
  if (!userEmail) {
    console.error('No payer email provided in webhook data');
    throw new Error('Payer email is required');
  }

  // Find user by email
  const user = await findUserByEmail(supabase, userEmail);
  const userId = user.id;

  // Determine plan type from amount or service_name
  const planType = determinePlanType(paymentAmount, service_name);
  console.log('Determined plan type:', planType, 'for amount:', paymentAmount);

  // Calculate expiration date (30 days from payment date)
  const expiresAt = calculateExpirationDate(paymentDateStr);
  console.log('Subscription will expire at:', expiresAt.toISOString());

  // Create new subscription
  const subscription = await createSubscription(
    supabase,
    userId,
    planType,
    expiresAt,
    paymentDateStr
  );

  return subscription;
};
