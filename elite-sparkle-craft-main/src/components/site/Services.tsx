import { motion } from "framer-motion";
import { Heart, Cake, Briefcase, Flower2, Sparkles, Music } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const services = [
  { icon: Heart, title: "Wedding Catering", desc: "Bespoke menus and seamless service for your most important day." },
  { icon: Cake, title: "Birthday Events", desc: "Themed celebrations crafted to surprise, delight and dazzle." },
  { icon: Briefcase, title: "Corporate Catering", desc: "Polished, on-time hospitality for conferences and galas." },
  { icon: Flower2, title: "South Indian Functions", desc: "Authentic traditional ceremonies with heritage cuisine." },
  { icon: Sparkles, title: "Stage Decoration", desc: "Floral, lighting and set design that transforms any venue." },
  { icon: Music, title: "Photography & DJ", desc: "Cinematic capture and curated soundscapes, end to end." },
];

export function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What We Do"
          title="Signature Services"
          subtitle="A full-spectrum studio for catering, decor and event direction — composed to your taste."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group relative h-full overflow-hidden rounded-2xl glass p-8 shadow-elev"
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl gold-border bg-background/50">
                    <s.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-2xl font-display">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
