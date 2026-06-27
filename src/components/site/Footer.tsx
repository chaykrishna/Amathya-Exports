import logo from "@/assets/amathya-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Amathya Exports" className="h-12 w-12 object-contain" />
              <p className="text-2xl tracking-[0.18em]" style={{ fontFamily: 'var(--font-brand)' }}>
                AMATHYA<span className="ml-2 text-muted-foreground">EXPORTS</span>
              </p>
            </div>
            <p className="max-w-xs text-sm font-light text-muted-foreground">
              The operating system for global trade. Hyderabad · Singapore · Rotterdam · New York.
            </p>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Amathya Exports Global Logistics. All systems nominal.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Legal</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
