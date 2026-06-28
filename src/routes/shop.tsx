import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

type Product = {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  in_stock: boolean;
};

const SPICE_IMAGES: Record<string, string> = {
  "Cardamom":     "https://images.unsplash.com/photo-1638177188759-5eb7d2a8aea9?w=400&q=80",
  "Saffron":      "https://images.unsplash.com/photo-1469909491685-40c69e56e206?w=400&q=80",
  "Black Pepper": "https://images.unsplash.com/photo-1548407260-da850faa41e3?w=400&q=80",
  "Cinnamon":     "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80",
  "Cloves":       "https://images.unsplash.com/photo-1552825898-a432e85f7d2f?w=400&q=80",
  "Turmeric":     "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  "Cumin":        "https://images.unsplash.com/photo-1603903631918-a3e0b7b7c7b7?w=400&q=80",
  "Coriander":    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80";
function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

useEffect(() => {
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true);

    console.log("Products:", data);
    console.log("Error:", error);

    if (error) {
      console.error(error);
    }

    setProducts(data ?? []);
    setLoading(false);
  };

  loadProducts();
}, []);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleAddToCart = (p: Product) => {
    addItem({ productId: p.id, name: p.name, unit: p.unit, quantity: 1 });
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Floating cart */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background shadow-2xl transition-all hover:scale-105 hover:opacity-90"
      >
        <ShoppingCart className="size-4" />
        Cart
        {cartCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-background">
            {cartCount}
          </span>
        )}
      </button>

      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Amathya Exports
          </p>
          <h1 className="mt-4 text-5xl font-light leading-tight tracking-tight md:text-6xl">
            Premium Indian <br />
            <em>Spices & Herbs</em>
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">
            Direct from origin farms. FSSAI & APEDA certified.<br />
            Available in bulk and retail quantities.
          </p>
          <div className="mt-6 flex items-center gap-6 text-[12px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green-500" />100% Pure</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green-500" />Farm Direct</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green-500" />Export Grade</span>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => {
              const inCart = items.find((i) => i.productId === p.id);
              const added = justAdded === p.id;
              const img = SPICE_IMAGES[p.name] || FALLBACK_IMAGE;

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={img}
                      alt={p.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {inCart && (
                      <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-primary text-background">
                        <Check className="size-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-light tracking-tight">{p.name}</h3>
                    <p className="mt-1.5 flex-1 text-[13px] font-light leading-relaxed text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {p.description}
                    </p>

                    <div className="mt-5">
                      {inCart ? (
                        <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-2.5">
                          <button
                            onClick={() => updateQuantity(p.id, inCart.quantity - 1)}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-secondary transition-colors"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {inCart.quantity} {p.unit}
                          </span>
                          <button
                            onClick={() => updateQuantity(p.id, inCart.quantity + 1)}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-secondary transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p)}
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-medium transition-all duration-200 ${
                            added
                              ? "bg-green-500 text-background"
                              : "bg-foreground text-background hover:opacity-80"
                          }`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {added ? (
                            <><Check className="size-3.5" strokeWidth={3} /> Added!</>
                          ) : (
                            <><ShoppingBag className="size-3.5" /> Add to Cart</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-base font-semibold">Your Cart</h2>
                <p className="text-xs text-muted-foreground">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="flex size-8 items-center justify-center rounded-full hover:bg-[#f5f5f5] text-muted-foreground">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="size-10 text-[#ddd] mb-3" />
                  <p className="text-sm text-muted-foreground">Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} className="mt-4 text-xs text-[#c8a96e] underline">Continue shopping</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-[#f0ece6] bg-background p-4">
                      <div className="size-12 overflow-hidden rounded-xl bg-secondary">
                        <img
                          src={SPICE_IMAGES[item.name] || FALLBACK_IMAGE}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-xl border border-border px-2 py-1">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                            <Minus className="size-3" />
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-3">
                <p className="text-xs text-center text-muted-foreground">Our team will contact you with pricing details after confirming your order.</p>
                <button
                  onClick={() => { setCartOpen(false); navigate({ to: "/checkout" }); }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-semibold text-background transition-colors hover:opacity-80"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
