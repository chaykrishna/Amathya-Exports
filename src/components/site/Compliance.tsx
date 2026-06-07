import { Download } from "lucide-react";
import sealImg from "@/assets/container-seal.jpg";

const CERTS = [
  { code: "FSSAI", desc: "Food Safety & Standards" },
  { code: "APEDA", desc: "Agri & Processed Food Export" },
  { code: "HACCP", desc: "Hazard Analysis Control" },
  { code: "ISO 22000", desc: "Food Safety Management" },
  { code: "FDA", desc: "US Food & Drug Admin." },
  { code: "GMP", desc: "Good Manufacturing Practice" },
  { code: "ORGANIC", desc: "USDA / EU Certified" },
  { code: "AEO", desc: "Authorized Economic Operator" },
];

export function Compliance() {
  return (
    <section id="compliance" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Compliance</span>
            <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
              Food safety, <span className="italic font-light text-muted-foreground">institutionally certified.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[15px] font-light leading-relaxed text-muted-foreground">
              Every shipment passes a 12-point quality verification. Cold-chain
              integrity, microbial testing and origin authentication — every
              certificate downloadable on demand.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CERTS.map((c) => (
                <div
                  key={c.code}
                  className="group flex aspect-square flex-col justify-between rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-secondary"
                >
                  <p className="text-[11px] font-semibold tracking-tight">{c.code}</p>
                  <div>
                    <Download className="mb-2 size-3.5 text-muted-foreground" />
                    <p className="text-[10px] leading-tight text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-secondary">
            <img
              src={sealImg}
              alt="Tamper-proof container seal"
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/80 p-4 backdrop-blur-md">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tamper Verification</p>
              <p className="mt-1 text-sm font-medium">Seal #882-901 · Cryptographic match</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
