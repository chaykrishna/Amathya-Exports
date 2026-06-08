// supabase/functions/whatsapp-notify/index.ts
// Deploy with: supabase functions deploy whatsapp-notify

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
const API_URL = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

async function sendWhatsAppMessage(to: string, message: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/[^0-9]/g, ""), // strip non-numeric
      type: "text",
      text: { body: message },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const {
      customerPhone,
      customerName,
      orderNumber,
      items,
      trackUrl,
    } = await req.json();

    // Message to customer from business account
    const itemsList = items
      .map((i: any) => `• ${i.name} — ${i.quantity} ${i.unit}`)
      .join("\n");

    const customerMessage =
      `Hi ${customerName}! 🌿\n\n` +
      `Your order *${orderNumber}* has been placed with *Amathya Exports*.\n\n` +
      `📦 *Items ordered:*\n${itemsList}\n\n` +
      `🔗 *Track your order:*\n${trackUrl}\n\n` +
      `Our team will contact you shortly with pricing and payment details.\n\n` +
      `For queries, reply to this message or call our executive.\n\n` +
      `Thank you for choosing Amathya Exports! 🙏`;

    await sendWhatsAppMessage(customerPhone, customerMessage);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("WhatsApp send error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
