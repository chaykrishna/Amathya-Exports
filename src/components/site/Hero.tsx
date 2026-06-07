import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export function Hero() {
  const [tracking, setTracking] = useState("");
  return (
    <section className="relative px-6 pt-24 pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="fade-up inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
            <span className="size-1.5 rounded-full bg-success pulse-dot" />
            Next-Gen Global Logistics
          </span>

          <h1
            className="fade-up mt-8 max-w-5xl text-balance text-[56px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[88px]"
            style={{ animationDelay: "80ms" }}
          >
            The Operating System
            <br />
            for{" "}
            <span className="italic font-light text-muted-foreground">Global Trade.</span>
          </h1>

          <p
            className="fade-up mt-8 max-w-2xl text-pretty text-lg font-light text-muted-foreground md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Ultra-secure, AI-driven export-import infrastructure for the world's
            most demanding enterprises. Live tracking. Instant clearance.
            Verified quality.
          </p>

          {/* Live tracker */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="fade-up group mt-12 w-full max-w-2xl"
            style={{ animationDelay: "240ms" }}
          >
            <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-secondary p-2 shadow-[var(--shadow-soft)] transition-all focus-within:border-foreground/20 focus-within:bg-background">
              <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                type="text"
                placeholder="Enter Container, BOL, or Reference Number"
                className="flex-1 bg-transparent px-2 py-3 text-[15px] outline-hidden placeholder:text-muted-foreground/70"
                aria-label="Track shipment"
              />
              <button
                type="submit"
                className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-foreground px-5 py-3 text-[13px] font-medium text-background transition-transform active:scale-[0.98]"
              >
                Track Shipment
                <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span>Try:</span>
              <button type="button" onClick={() => setTracking("AETH-8829-001X")} className="hover:text-foreground">AETH-8829-001X</button>
              <span className="text-border">/</span>
              <button type="button" onClick={() => setTracking("MAEU-7720-441")} className="hover:text-foreground">MAEU-7720-441</button>
            </div>
          </form>

          {/* CTA row */}
          <div
            className="fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "320ms" }}
          >
            <a href="/shop" className="rounded-full border border-border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-secondary">
  Shop Now
</a>
            <a href="https://wa.me/" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
              <span className="size-1.5 rounded-full bg-white pulse-dot" />
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
