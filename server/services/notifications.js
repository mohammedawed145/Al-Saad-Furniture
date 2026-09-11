import { config } from '../config/env.js';

export async function notifyNewMessage(message) {
  if (!config.resendApiKey || !config.notificationEmail) return;

  const product = message.productName ? `\nالمنتج: ${message.productName}` : '';
  const text = `رسالة جديدة من الموقع\nالاسم: ${message.name}\nالبريد: ${message.email}\nالهاتف: ${message.phone}${product}\n\n${message.message}`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Al-Saad Furniture <onboarding@resend.dev>',
      to: [config.notificationEmail],
      subject: `رسالة جديدة من ${message.name}`,
      text,
    }),
  });

  if (!response.ok) throw new Error(`Notification provider returned ${response.status}`);
}
