import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/amathya-logo.png";


export function Nav() {
  const { user } = useAuth();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Amathya Exports" className="h-9 w-9 object-contain" />
            <span className="text-[16px] tracking-[0.18em]" style={{ fontFamily: 'var(--font-brand)' }}>
              AMATHYA<span className="ml-1.5 text-muted-foreground">EXPORTS</span>
            </span>
          </Link>
          <div className="hidden gap-8 text-[13px] font-medium text-muted-foreground md:flex">
            <a href="#solutions" className="transition-colors hover:text-foreground">Solutions</a>
            <a href="#compliance" className="transition-colors hover:text-foreground">Compliance</a>
            <a href="/shop" className="transition-colors hover:text-foreground">Shop</a>
         
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90">
              Open Portal
            </Link>
          ) : (
            <>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
