import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import logo from "@/assets/amathya-logo.png";

export function Nav() {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left — logo + links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Amathya Exports" className="h-9 w-9 object-contain" />
            <span className="text-[16px] tracking-[0.18em]" style={{ fontFamily: "var(--font-brand)" }}>
              AMATHYA<span className="ml-1.5 text-muted-foreground">EXPORTS</span>
            </span>
          </Link>
          <div className="hidden gap-8 text-[13px] font-medium text-muted-foreground md:flex">
            <a href="#solutions" className="transition-colors hover:text-foreground">Solutions</a>
            <a href="#compliance" className="transition-colors hover:text-foreground">Compliance</a>
            <a href="/shop" className="transition-colors hover:text-foreground">Shop</a>
          </div>
        </div>

          {/* Premium Admin Button → goes to login page */}
          <Link
            to="/admin-login"
            className="group relative flex items-center gap-2 rounded-xl border border-[#c8a96e]/40 bg-[#fdf8f0] px-3.5 py-2 text-[12px] font-semibold text-[#a07840] transition-all duration-200 hover:border-[#c8a96e] hover:bg-[#fdf3e3] hover:shadow-[0_0_0_3px_rgba(200,169,110,0.12)]"
          >
            <Lock className="size-3.5 transition-transform duration-200 group-hover:scale-110" />
            Admin
            <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#c8a96e] opacity-80 animate-pulse" />
          </Link>
        </div>
    </nav>
  );
}