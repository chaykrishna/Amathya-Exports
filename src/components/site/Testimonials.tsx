const QUOTES = [
  { q: "Amathya Exports replaced our broker, freight forwarder and customs desk with a single dashboard. Margins up 14%.", a: "Director of Operations", c: "Global Foods Inc." },
  { q: "We finally have ground-truth on every shipment. Our auditors love the traceability reports.", a: "Head of Supply Chain", c: "Pharmacore" },
  { q: "AI quote in 11 seconds. Documents in two minutes. It used to take a week.", a: "Export Manager", c: "Maritime Alliance" },
];

export function Testimonials() {
  return (
    <section className="bg-surface px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operators speak</span>
        <h2 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl">
          Trusted by exporters moving <span className="italic font-light text-muted-foreground">billion-dollar cargo.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <figure key={i} className="flex flex-col justify-between rounded-3xl border border-border bg-background p-8 shadow-[var(--shadow-soft)]">
              <blockquote className="text-[17px] font-light leading-relaxed">"{q.q}"</blockquote>
              <figcaption className="mt-8 border-t border-border pt-4">
                <p className="text-sm font-medium">{q.a}</p>
                <p className="text-xs text-muted-foreground">{q.c}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
