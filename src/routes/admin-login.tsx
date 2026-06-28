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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      console.error(error);

      setError(error.message);
      setShake(true);

      setTimeout(() => setShake(false), 500);
      setLoading(false);
      return;
    }

    console.log("USER:", data.user);

    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
      <div
        className="w-full max-w-sm"
        style={{ animation: "slideUp 0.3s ease" }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-[#e8e0d5] bg-[#fdf8f0]">
            <ShieldCheck className="size-7 text-[#c8a96e]" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">
            Admin Portal
          </h1>

          <p className="mt-1 text-[13px] text-[#999]">
            Amathya Exports — Restricted Access
          </p>
        </div>

        <div
          className={`rounded-2xl border border-[#e8e0d5] bg-white p-8 shadow-sm ${
            shake ? "animate-shake" : ""
          }`}
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
                placeholder="Enter E-mail"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-[#e8e0d5] bg-[#faf9f7] focus:border-[#c8a96e] focus:bg-white"
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
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all ${
                    error
                      ? "border-red-300 bg-red-50"
                      : "border-[#e8e0d5] bg-[#faf9f7] focus:border-[#c8a96e] focus:bg-white"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] transition-colors hover:text-[#888]"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                <Lock className="size-3.5 shrink-0 text-red-400" />
                <p className="text-[12px] font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 w-full rounded-xl bg-[#1a1a1a] py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#c8a96e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying...
                </span>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#ccc]">
          Amathya Exports · Admin Only
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.4s ease;
        }
      `}</style>
    </div>
  );
}