import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "./Reveal";

const reviews = [
  { name: "Anjali & Rohit", role: "Wedding · Chennai", text: "From the mandap florals to the late-night biryani counter, every single detail felt curated. Our guests are still talking about it.", rating: 5 },
  { name: "Vikram Iyer", role: "Corporate Gala · Bengaluru", text: "Faultless execution for 600 guests. Polished, on-time and the food was exceptional. Easily the best vendor we've worked with.", rating: 5 },
  { name: "Meera Krishnan", role: "60th Birthday · Coimbatore", text: "They turned our family hall into something out of a film. The traditional South Indian menu was straight from amma's kitchen.", rating: 5 },
  { name: "Arjun Reddy", role: "Engagement · Hyderabad", text: "Elegant, calm and incredibly organized. The team made the day feel effortless for the family.", rating: 5 },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="testimonials" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeading eyebrow="Kind Words" title="Loved by our clients" />

        <div className="relative mt-16 min-h-[280px]">
          <Quote className="mx-auto h-10 w-10 text-gold/40" />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <p className="font-display text-2xl leading-relaxed sm:text-3xl">"{reviews[i].text}"</p>
              <div className="mt-8 flex items-center justify-center gap-1">
                {Array.from({ length: reviews[i].rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-[var(--gold)] text-gold" />
                ))}
              </div>
              <p className="mt-4 font-medium text-gold">{reviews[i].name}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{reviews[i].role}</p>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {reviews.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gold" : "w-2 bg-muted"}`}
              aria-label={`Review ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
