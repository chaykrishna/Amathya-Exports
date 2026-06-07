import { Bot, QrCode, Scale, Sparkles, ShieldCheck, Globe } from "lucide-react";

const SERVICES = [
  { icon: Bot, title: "AI-Powered Customs", body: "Automated HS code classification and document validation. Cut clearance time by up to 60%." },
  { icon: QrCode, title: "Verified Traceability", body: "QR-based blockchain verification for every pallet — from farm-gate to final destination." },
  { icon: Sparkles, title: "Predictive Analytics", body: "Anticipate port strikes, weather delays and bottlenecks with live satellite telemetry." },
  { icon: Scale, title: "Instant Quote Engine", body: "AI estimates shipping cost, duties, customs time and ETA in seconds." },
  { icon: ShieldCheck, title: "Supplier Verification", body: "Multi-layer KYC with audited factory reports and live quality grading." },
  { icon: Globe, title: "Multi-Language Support", body: "24/7 assistance across 14 languages and 24 time zones." },
];

export function Services() {
  return (
    <section id="solutions" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Solutions</span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Built for enterprises that <span className="italic font-light text-muted-foreground">cannot afford friction.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-5">
              <div className="grid size-10 place-items-center rounded-xl bg-secondary">
                <Icon className="size-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium">{title}</h3>
              <p className="max-w-[42ch] text-[15px] font-light leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
