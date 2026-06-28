import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
  console.error(error);
  setError(error.message);
  setShake(true);
  setTimeout(() => setShake(false), 500);
  setLoading(false);
  return;
}
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <div
        className="w-full max-w-sm"
        style={{ animation: "slideUp 0.3s ease" }}
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-[#e8e0d5] bg-[#fdf8f0]">
            <ShieldCheck className="size-7 text-[#c8a96e]" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="mt-1 text-[13px] text-[#999]">Amathya Exports — Restricted Access</p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl border border-[#e8e0d5] bg-white p-8 shadow-sm ${shake ? "animate-shake" : ""}`}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#999]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@amathyaexports.com"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  error ? "border-red-300 bg-red-50" : "border-[#e8e0d5] bg-[#faf9f7] focus:border-[#c8a96e] focus:bg-white"
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#999]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all ${
                    error ? "border-red-300 bg-red-50" : "border-[#e8e0d5] bg-[#faf9f7] focus:border-[#c8a96e] focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#888] transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                <Lock className="size-3.5 text-red-400 shrink-0" />
                <p className="text-[12px] font-medium text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-xl bg-[#1a1a1a] py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#c8a96e] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifying…
                </span>
              ) : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#ccc]">
          Amathya Exports · Admin Only
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}