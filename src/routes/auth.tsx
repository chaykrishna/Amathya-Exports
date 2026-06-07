import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Amathya Exports Customer Portal" },
      { name: "description", content: "Access your Amathya Exports portal: live shipment tracking, stock visibility, real-time notifications." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
    if (r.error) toast.error("Google sign-in failed");
    if (!r.redirected && !r.error) navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-border p-12 lg:flex">
          <Link to="/" className="text-[17px] font-semibold tracking-tight">
            AMATHYA<span className="font-light text-muted-foreground"> EXPORTS</span>
          </Link>
          <div className="space-y-6">
            <h1 className="text-5xl font-medium leading-[1.05] tracking-tight">
              The customer portal for <span className="italic font-light text-muted-foreground">global trade.</span>
            </h1>
            <p className="max-w-md text-[15px] font-light text-muted-foreground">
              Live shipment tracking, real-time stock visibility, instant notifications, and the world's most trusted compliance pipeline — all in one workspace.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <div><p className="text-2xl font-medium text-foreground">142</p>Live shipments</div>
              <div><p className="text-2xl font-medium text-foreground">38</p>Global ports</div>
              <div><p className="text-2xl font-medium text-foreground">99.97%</p>Uptime</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Amathya Exports</p>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="text-[17px] font-semibold tracking-tight">
                AMATHYA<span className="font-light text-muted-foreground"> EXPORTS</span>
              </Link>
            </div>
            <h2 className="text-3xl font-medium tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your portal"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to your customer dashboard." : "Start tracking shipments in 60 seconds."}
            </p>

            <button
              onClick={google}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <svg className="size-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handle} className="space-y-3">
              {mode === "signup" && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/30 focus:bg-background"
                />
              )}
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/30 focus:bg-background"
              />
              <input
                type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/30 focus:bg-background"
              />
              <button
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "signin" ? "New to Amathya?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-foreground underline-offset-4 hover:underline">
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
