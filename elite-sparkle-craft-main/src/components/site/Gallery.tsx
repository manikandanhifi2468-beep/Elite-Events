import { motion } from "framer-motion";
import { SectionHeading } from "./Reveal";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

const items = [
  { src: g2, label: "Wedding Decor", span: "row-span-2" },
  { src: g4, label: "Corporate Gala", span: "" },
  { src: g1, label: "Plated Cuisine", span: "row-span-2" },
  { src: g3, label: "Birthday Soiree", span: "" },
  { src: g6, label: "Stage Design", span: "" },
  { src: g5, label: "Traditional Feast", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments we've crafted"
          subtitle="A glimpse into the events, decor and dishes our clients remember."
        />

        <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl gold-border ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />
              <figcaption className="absolute bottom-4 left-4 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-gold">Featured</span>
                <p className="font-display text-lg">{it.label}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
