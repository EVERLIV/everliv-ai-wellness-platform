
export interface WebhookData {
  sum?: string;
  amount?: string;
  payerEmail?: string;
  payer_email?: string;
  email?: string;
  paymentDate?: string;
  payment_date?: string;
  date?: string;
  service_name?: string;
  orderid?: string;
  order_id?: string;
  transaction_id?: string;
  mdOrder?: string;
  orderId?: string;
  token?: string;
  callback_token?: string;
  // Поля для цифровой подписи
  signature?: string;
  approvalCode?: string;
  approvedAmount?: string;
  merchantId?: string;
}

export const parseWebhookData = async (req: Request): Promise<WebhookData> => {
  let webhookData: Record<string, string> = {};

  // Handle different content types from Alfa Bank
  const contentType = req.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    // JSON payload
    const jsonData = await req.json();
    console.log('JSON webhook data:', jsonData);
    webhookData = jsonData;
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    // Form data
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString();
    }
    console.log('Form webhook data:', webhookData);
  } else {
    // Try to parse as text and then as form data
    const body = await req.text();
    console.log('Raw webhook body:', body);
    
    if (body.includes('=') && body.includes('&')) {
      // Parse as URL encoded
      const params = new URLSearchParams(body);
      for (const [key, value] of params.entries()) {
        webhookData[key] = value;
      }
    } else {
      try {
        webhookData = JSON.parse(body);
      } catch {
        console.error('Could not parse webhook body:', body);
        throw new Error('Invalid payload format');
      }
    }
  }

  console.log('Parsed webhook data:', webhookData);
  return webhookData as WebhookData;
};

export const verifyCallbackToken = (webhookData: WebhookData, req: Request, callbackToken: string): boolean => {
  const receivedToken = webhookData.token || webhookData.callback_token || req.headers.get('x-paykeeper-token');
  
  if (callbackToken && receivedToken && receivedToken !== callbackToken) {
    console.error('Invalid callback token received:', receivedToken);
    return false;
  }
  
  return true;
};

export const verifyDigitalSignature = async (webhookData: WebhookData, publicKey: string): Promise<boolean> => {
  try {
    // Если нет подписи, пропускаем проверку
    if (!webhookData.signature) {
      console.log('No digital signature found, skipping signature verification');
      return true;
    }

    console.log('Verifying digital signature...');
    
    // Строим строку для подписи из основных параметров платежа
    const signatureData = [
      webhookData.sum || webhookData.amount || '',
      webhookData.payerEmail || webhookData.payer_email || webhookData.email || '',
      webhookData.approvalCode || '',
      webhookData.merchantId || '',
      webhookData.orderid || webhookData.order_id || webhookData.transaction_id || ''
    ].join('|');

    console.log('Signature data string:', signatureData);

    // Импортируем публичный ключ
    const publicKeyData = await crypto.subtle.importKey(
      'spki',
      new TextEncoder().encode(publicKey),
      {
        name: 'RSA-PSS',
        hash: 'SHA-256'
      },
      false,
      ['verify']
    );

    // Декодируем подпись из base64
    const signatureBytes = Uint8Array.from(atob(webhookData.signature), c => c.charCodeAt(0));
    
    // Кодируем данные для проверки
    const dataBytes = new TextEncoder().encode(signatureData);

    // Проверяем подпись
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32
      },
      publicKeyData,
      signatureBytes,
      dataBytes
    );

    console.log('Digital signature verification result:', isValid);
    return isValid;

  } catch (error) {
    console.error('Error verifying digital signature:', error);
    // В случае ошибки верификации не блокируем платеж, но логируем
    return true;
  }
};
