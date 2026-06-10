import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Clock, CheckCircle, Truck, MapPin, RefreshCw, Bell, ChevronLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: OwnerDashboard,
});

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  created_at: string;
  order_items?: { product_name: string; quantity: number; unit: string }[];
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: MapPin,
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin-login" });
    });
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(product_name, quantity, unit)")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          if (isFirstLoad.current) return;
          const { data } = await supabase
            .from("orders")
            .select("*, order_items(product_name, quantity, unit)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setOrders((prev) => [data as Order, ...prev]);
            setNewOrderIds((prev) => new Set([...prev, data.id]));
            toast.success(`🌿 New order from ${(data as Order).customer_name}!`, {
              duration: 6000,
              description: `Order ${(data as Order).order_number} just came in`,
            });
            setTimeout(() => {
              setNewOrderIds((prev) => {
                const next = new Set(prev);
                next.delete(data.id);
                return next;
              });
            }, 10000);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o))
          );
        }
      )
      .subscribe(() => {
        isFirstLoad.current = false;
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    setUpdating(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="border-b border-[#e8e0d5] bg-white px-6 py-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-1 rounded-xl border border-[#e8e0d5] px-3 py-2 text-xs font-medium text-[#999] hover:bg-[#faf9f7] hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="size-3.5" /> Back
            </button>

            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1a1a1a]">
              <Package className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Amathya Exports — Orders</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-green-600">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                Live updates active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 rounded-xl border border-[#e8e0d5] bg-white px-3 py-2 text-xs font-medium hover:bg-[#faf9f7] transition-colors"
            >
              <RefreshCw className="size-3.5" /> Refresh
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-[#e8e0d5] bg-white px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="size-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUS_OPTIONS.map((s) => {
            const Icon = STATUS_ICONS[s];
            return (
              <div key={s} className="rounded-2xl border border-[#e8e0d5] bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999] capitalize">{s}</p>
                  <Icon className="size-4 text-[#ccc]" />
                </div>
                <p className="mt-2 text-3xl font-light tabular-nums">{counts[s] ?? 0}</p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {["all", ...STATUS_OPTIONS].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-[#1a1a1a] text-white"
                  : "border border-[#e8e0d5] bg-white hover:bg-[#faf9f7]"
              }`}
            >
              {f === "all" ? `All (${orders.length})` : `${f} (${counts[f] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-[#eee]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
            <Package className="size-10 text-[#ddd]" />
            <p className="text-sm text-[#999]">No orders yet</p>
            <p className="text-xs text-[#bbb]">New orders will appear here instantly</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const Icon = STATUS_ICONS[order.status];
              const isNew = newOrderIds.has(order.id);
              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border bg-white p-6 transition-all duration-500 ${
                    isNew
                      ? "border-[#c8a96e] shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
                      : "border-[#e8e0d5]"
                  }`}
                >
                  {isNew && (
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#c8a96e]">
                      <Bell className="size-3" /> New Order
                    </div>
                  )}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-semibold">{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                          <Icon className="size-3" />
                          {order.status}
                        </span>
                        <span className="text-xs text-[#999]">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#999]">Customer</p>
                          <p className="mt-0.5 text-sm font-medium">{order.customer_name}</p>
                          
                         <a href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-600 hover:underline"
          >
            📱 {order.customer_phone}
          </a>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#999]">Address</p>
                          <p className="mt-0.5 text-sm text-[#666]">{order.customer_address}</p>
                        </div>
                      </div>

                      {order.order_items && order.order_items.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] uppercase tracking-wider text-[#999] mb-2">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.order_items.map((item, i) => (
                              <span key={i} className="rounded-lg bg-[#faf9f7] border border-[#e8e0d5] px-3 py-1 text-xs font-medium">
                                {item.product_name} — {item.quantity} {item.unit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="rounded-xl border border-[#e8e0d5] bg-white px-3 py-2 text-xs font-medium outline-none cursor-pointer hover:bg-[#faf9f7] transition-colors capitalize"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                      
                       <a
                        href={`/order/${order.order_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#999] underline-offset-2 hover:underline"
                      >
                        View tracking page ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}