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
  <Link
    to="/"
    hash="solutions"
    className="transition-colors hover:text-foreground"
  >
    Solutions
  </Link>

  <Link
    to="/"
    hash="compliance"
    className="transition-colors hover:text-foreground"
  >
    Compliance
  </Link>

  <Link
    to="/shop"
    className="transition-colors hover:text-foreground"
  >
    Shop
  </Link>
</div>
        </div>        
        </div>
    </nav>
  );
}