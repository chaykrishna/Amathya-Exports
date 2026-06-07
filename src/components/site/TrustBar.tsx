const LOGOS = ["GLOBAL FOODS", "MARITIME ALLIANCE", "PHARMACORE", "EURO FREIGHT", "AEROSTREAM", "NORDIC TRADE"];

export function TrustBar() {
  return (
    <div className="border-y border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by exporters in 47 countries
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {LOGOS.map((l) => (
            <span key={l} className="text-sm font-bold tracking-tighter text-foreground/40">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
