import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import about from "@/assets/about.jpg";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(to * (0.5 - Math.cos(Math.PI * p) / 2)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: "+", label: "Events Managed" },
  { value: 10000, suffix: "+", label: "Guests Served" },
  { value: 5, suffix: "Y", label: "Years Experience" },
];

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/10 blur-2xl" />
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl gold-border shadow-elev"
            >
              <img src={about} alt="Chef plating a dish" loading="lazy" className="h-[560px] w-full object-cover" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Est. 2019</p>
                <p className="mt-1 font-display text-xl">A studio of taste and detail.</p>
              </div>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">About the studio</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl">
              Where heritage meets <span className="gradient-text italic">haute</span> hospitality.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-muted-foreground">
              Elite Events & Catering is a boutique collective of chefs, designers and planners. We design ceremonies, intimate dinners and grand corporate galas with the same obsessive eye for detail — and a deep respect for South Indian tradition.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Mission</p>
                <p className="mt-2 text-sm text-muted-foreground">Turn fleeting moments into heirlooms — through food, design and hospitality.</p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Vision</p>
                <p className="mt-2 text-sm text-muted-foreground">Be South India's most trusted name in luxury celebrations.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl gold-border bg-card/40 p-5 text-center">
                  <div className="font-display text-3xl text-gold sm:text-4xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
