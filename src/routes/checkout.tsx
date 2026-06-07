import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", notes: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setLoading(true);

    try {
      // 1. Save order to Supabase
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          customer_address: form.address,
          notes: form.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderErr || !order) throw orderErr ?? new Error("Failed to place order");

      // 2. Save order items
      await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_name: i.name,
          quantity: i.quantity,
          unit: i.unit,
        }))
      );

      const trackUrl = `${window.location.origin}/order/${order.order_number}`;

      // 3. Send customer confirmation email (silent — no popup)
      if (form.email) {
        await supabase.functions.invoke("send-order-email", {
          body: {
            email: form.email,
            name: form.name,
            orderNumber: order.order_number,
            items,
            trackUrl,
          },
        }).catch(() => {}); // silent fail
      }

      // 4. Send owner email alert (silent — no popup)
      await supabase.functions.invoke("notify-owner", {
        body: {
          orderNumber: order.order_number,
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: form.address,
          notes: form.notes,
          items,
          trackUrl,
        },
      }).catch(() => {}); // silent fail

      clearCart();
      navigate({ to: "/order/$orderNumber", params: { orderNumber: order.order_number } });

    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Nav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <ShoppingBag className="size-12 text-[#ccc]" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <Link to="/shop" className="rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-medium text-white">
            Browse Spices
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c8a96e]">Checkout</span>
          <h1 className="mt-3 text-3xl font-light tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Complete your order
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <form onSubmit={placeOrder} className="space-y-4 lg:col-span-3">
            <div className="rounded-2xl border border-[#e8e0d5] bg-white p-6">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#999]">Your Details</h3>
              <div className="space-y-3">
                <input required value={form.name} onChange={set("name")}
                  placeholder="Full name *"
                  className="w-full rounded-xl border border-[#e8e0d5] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e] focus:bg-white" />
                <input required value={form.phone} onChange={set("phone")}
                  placeholder="WhatsApp number with country code e.g. 919876543210 *" type="tel"
                  className="w-full rounded-xl border border-[#e8e0d5] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e] focus:bg-white" />
                <input value={form.email} onChange={set("email")}
                  placeholder="Email for order confirmation (optional)" type="email"
                  className="w-full rounded-xl border border-[#e8e0d5] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e] focus:bg-white" />
                <textarea required value={form.address} onChange={set("address") as any}
                  placeholder="Delivery address *" rows={3}
                  className="w-full resize-none rounded-xl border border-[#e8e0d5] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e] focus:bg-white" />
                <textarea value={form.notes} onChange={set("notes") as any}
                  placeholder="Special instructions (optional)" rows={2}
                  className="w-full resize-none rounded-xl border border-[#e8e0d5] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c8a96e] focus:bg-white" />
              </div>
            </div>

            <button disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a1a] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#c8a96e] disabled:opacity-60">
              {loading ? "Placing order…" : "Place Order"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="text-center text-xs text-[#999]">
              {form.email
                ? "📧 A confirmation email will be sent to you."
                : "Add your email above to receive an order confirmation."}
            </p>
          </form>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-[#e8e0d5] bg-white p-6">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#999]">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[#999]">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-[#faf9f7] p-4 text-[12px] text-[#888]">
                💬 Our team will contact you with pricing and payment details after confirming your order.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
