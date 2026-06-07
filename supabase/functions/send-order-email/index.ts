// supabase/functions/send-order-email/index.ts
// Deploy with: supabase functions deploy send-order-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "onboarding@resend.dev"; // change to your domain

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const { email, name, orderNumber, items, trackUrl } = await req.json();

  const itemsHtml = items
    .map((i: any) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f0ece6">${i.name}</td><td style="padding:8px 0;border-bottom:1px solid #f0ece6;text-align:right;color:#888">${i.quantity} ${i.unit}</td></tr>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d5">
    
    <div style="background:#1a1a1a;padding:32px;text-align:center">
      <p style="color:#c8a96e;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px">Amathya Exports</p>
      <h1 style="color:#fff;font-size:24px;font-weight:300;margin:0;font-family:Georgia,serif">Order Confirmed 🌿</h1>
    </div>

    <div style="padding:32px">
      <p style="color:#333;font-size:15px;margin:0 0 8px">Hi <strong>${name}</strong>,</p>
      <p style="color:#666;font-size:14px;line-height:1.6;margin:0 0 24px">
        Thank you for your order! We've received it and our team will contact you shortly with pricing and payment details.
      </p>

      <div style="background:#faf9f7;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 4px">Order Number</p>
        <p style="font-size:20px;font-weight:600;color:#1a1a1a;margin:0;font-family:monospace">${orderNumber}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.15em;padding-bottom:8px;border-bottom:2px solid #f0ece6">Item</th>
            <th style="text-align:right;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.15em;padding-bottom:8px;border-bottom:2px solid #f0ece6">Qty</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <a href="${trackUrl}" style="display:block;background:#1a1a1a;color:#fff;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:20px">
        Track Your Order →
      </a>

      <p style="color:#999;font-size:12px;text-align:center;line-height:1.6;margin:0">
        Questions? Reply to this email or WhatsApp us.<br/>
        <strong style="color:#c8a96e">Amathya Exports</strong> — Hyderabad, India
      </p>
    </div>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmed — ${orderNumber} | Amathya Exports`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
