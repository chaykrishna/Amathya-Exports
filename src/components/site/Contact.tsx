import { ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-border bg-foreground p-10 text-background md:p-20">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
            <div>
              <h2 className="max-w-[20ch] text-balance text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                Ready to scale your global operations?
              </h2>
              <p className="mt-6 max-w-md text-[15px] font-light text-background/60">
                Speak with an export engineer. Architect a routing strategy
                tailored to your products, ports and timelines.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <a href="mailto:contact@amathya.com" className="group inline-flex items-center justify-between gap-6 rounded-2xl bg-background px-6 py-4 text-foreground transition-transform active:scale-[0.99]">
                <span className="text-sm font-medium">Contact Sales</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="https://wa.me/" className="group inline-flex items-center justify-between gap-6 rounded-2xl bg-[#25D366] px-6 py-4 text-white transition-transform active:scale-[0.99]">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <span className="size-1.5 rounded-full bg-white pulse-dot" />
                  WhatsApp Direct
                </span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#" className="group inline-flex items-center justify-between gap-6 rounded-2xl border border-background/15 px-6 py-4 transition-colors hover:bg-background/5">
                <span className="text-sm font-medium">Request Quote</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
