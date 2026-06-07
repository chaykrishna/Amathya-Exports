import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, CheckCircle, Truck, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order/$orderNumber")({
  component: OrderPage,
});

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
};

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (!orderData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id);

      setItems((itemsData as OrderItem[]) ?? []);
      setLoading(false);
    }
    load();
  }, [orderNumber]);

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order?.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <Package className="size-12 text-muted-foreground" />
          <h2 className="text-xl font-medium">Order not found</h2>
          <p className="text-sm text-muted-foreground">Check your order number and try again.</p>
          <Link to="/shop" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-24">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary">
            <Package className="size-7" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Order Tracking
          </span>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">{order?.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order!.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Status tracker */}
        <div className="mb-10 rounded-2xl border border-border bg-background p-6">
          <div className="relative flex items-start justify-between">
            {/* Progress line */}
            <div className="absolute left-0 right-0 top-5 h-px bg-border" />
            <div
              className="absolute left-0 top-5 h-px bg-foreground transition-all"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentStep;
              return (
                <div key={step.key} className="relative flex flex-col items-center gap-2 text-center">
                  <div className={`relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"}`}>
                    <Icon className="size-4" />
                  </div>
                  <p className={`text-[11px] font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order details */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Items */}
          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Items Ordered</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.product_name}</span>
                  <span className="text-muted-foreground">{item.quantity} {item.unit}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex items-center justify-between font-medium">
                <span>Total</span>
                <span>₹{order!.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Delivery Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Name</p>
                <p className="mt-0.5 font-medium">{order?.customer_name}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Address</p>
                <p className="mt-0.5 text-muted-foreground">{order?.customer_address}</p>
              </div>
              {order?.notes && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Notes</p>
                  <p className="mt-0.5 text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 rounded-2xl border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Have questions about your order?</p>
          <a
            href={`https://wa.me/91XXXXXXXXXX?text=Hi, I have a question about my order ${order?.order_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <span className="size-1.5 rounded-full bg-white" />
            Message us on WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
