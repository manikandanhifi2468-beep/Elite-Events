import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const packages = [
  {
    name: "Basic",
    price: "₹49,999",
    tag: "Intimate gatherings",
    features: ["Up to 50 guests", "3-course curated menu", "Standard decor setup", "On-site coordinator", "Tableware & service"],
  },
  {
    name: "Premium",
    price: "₹1,49,999",
    tag: "Most chosen",
    featured: true,
    features: ["Up to 200 guests", "7-course chef's menu", "Themed decor & florals", "Photography (4 hrs)", "DJ & live counter", "Full event direction"],
  },
  {
    name: "Luxury",
    price: "₹3,99,999",
    tag: "Signature experience",
    features: ["500+ guests", "Tasting + bespoke menu", "Couture stage & lighting", "Cinematic photo + video", "Live band & DJ", "Dedicated planning team"],
  },
];

export function Packages() {
  return (
    <section id="packages" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Packages"
          title="Curated for every celebration"
          subtitle="Transparent pricing. Custom builds available on request."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={`relative h-full overflow-hidden rounded-3xl p-8 ${
                  p.featured
                    ? "gold-border bg-gradient-to-b from-gold/10 to-card shadow-gold"
                    : "glass"
                }`}
              >
                {p.featured && (
                  <div className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
                    <Crown className="h-3 w-3" /> Popular
                  </div>
                )}
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{p.tag}</p>
                <h3 className="mt-3 font-display text-3xl">{p.name} Package</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl gradient-text">{p.price}</span>
                  <span className="text-xs text-muted-foreground">starting</span>
                </div>
                <div className="my-6 h-px w-full bg-gradient-to-r from-gold/40 via-transparent to-transparent" />
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] ${
                    p.featured
                      ? "bg-gold text-primary-foreground shadow-gold"
                      : "gold-border text-foreground hover:text-gold"
                  }`}
                >
                  Book Now
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
