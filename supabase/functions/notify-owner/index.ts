// supabase/functions/notify-owner/index.ts
// Deploy with: supabase functions deploy notify-owner

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL"); // set this in Supabase secrets

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const { orderNumber, customerName, customerPhone, customerAddress, notes, items, trackUrl } = await req.json();

  const itemsHtml = items
    .map((i: any) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece6;font-size:14px">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece6;font-size:14px;text-align:right;color:#888">${i.quantity} ${i.unit}</td>
    </tr>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d5">
    
    <div style="background:#1a1a1a;padding:28px 32px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <p style="color:#c8a96e;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px">Amathya Exports</p>
        <h1 style="color:#fff;font-size:20px;font-weight:600;margin:0">🌿 New Order Received</h1>
      </div>
      <div style="background:#c8a96e;border-radius:10px;padding:8px 14px;text-align:center">
        <p style="color:#fff;font-size:10px;margin:0;font-weight:600;letter-spacing:0.1em">${orderNumber}</p>
      </div>
    </div>

    <div style="padding:32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6">
            <p style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 3px">Customer</p>
            <p style="font-size:14px;font-weight:600;color:#1a1a1a;margin:0">${customerName}</p>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;text-align:right">
            <p style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 3px">Phone</p>
            <p style="font-size:14px;font-weight:600;color:#1a1a1a;margin:0">${customerPhone}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 0;border-bottom:1px solid #f0ece6">
            <p style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 3px">Delivery Address</p>
            <p style="font-size:14px;color:#444;margin:0">${customerAddress}</p>
          </td>
        </tr>
        ${notes ? `<tr><td colspan="2" style="padding:10px 0;border-bottom:1px solid #f0ece6">
          <p style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 3px">Notes</p>
          <p style="font-size:14px;color:#444;margin:0">${notes}</p>
        </td></tr>` : ""}
      </table>

      <p style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px">Items Ordered</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
        <thead>
          <tr>
            <th style="text-align:left;font-size:10px;color:#bbb;text-transform:uppercase;letter-spacing:0.15em;padding-bottom:8px;border-bottom:2px solid #f0ece6">Product</th>
            <th style="text-align:right;font-size:10px;color:#bbb;text-transform:uppercase;letter-spacing:0.15em;padding-bottom:8px;border-bottom:2px solid #f0ece6">Quantity</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <a href="${trackUrl}" style="display:block;background:#1a1a1a;color:#fff;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:600;margin-bottom:16px">
        View Order in Dashboard →
      </a>

      <p style="color:#bbb;font-size:11px;text-align:center;margin:0">
        This is an automated notification from Amathya Exports order system.
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
      from: "onboarding@resend.dev",
      to: OWNER_EMAIL,
      subject: `🌿 New Order ${orderNumber} — ${customerName}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
