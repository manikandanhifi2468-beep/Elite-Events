import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { toast } from "sonner";

const eventTypes = ["Wedding", "Birthday", "Corporate", "Traditional"];
const foodTypes = ["Vegetarian", "Non-Vegetarian", "South Indian", "Multi-Cuisine"];

export function Planner() {
  const [eventType, setEventType] = useState("Wedding");
  const [guests, setGuests] = useState(150);
  const [budget, setBudget] = useState(200000);
  const [food, setFood] = useState("Multi-Cuisine");
  const [result, setResult] = useState<null | { cost: number; pkg: string; menu: string[] }>(null);

  const compute = (e: React.FormEvent) => {
    e.preventDefault();
    const perGuest = food === "South Indian" ? 850 : food === "Vegetarian" ? 950 : food === "Non-Vegetarian" ? 1400 : 1200;
    const eventMult = eventType === "Wedding" ? 1.4 : eventType === "Corporate" ? 1.2 : eventType === "Traditional" ? 1.15 : 1;
    const cost = Math.round(guests * perGuest * eventMult);
    const pkg = cost > 300000 ? "Luxury" : cost > 100000 ? "Premium" : "Basic";
    const menus: Record<string, string[]> = {
      "South Indian": ["Banana leaf thali", "Sambar & rasam course", "Filter coffee finale", "Sweet & savory bites"],
      Vegetarian: ["Saffron paneer tikka", "Truffle khichdi", "Heirloom dal", "Pistachio kulfi"],
      "Non-Vegetarian": ["Coastal prawn curry", "Pepper chicken roast", "Lamb biryani", "Caramel custard"],
      "Multi-Cuisine": ["Mezze platter", "Wood-fired pizza", "Butter chicken", "Tiramisu mousse"],
    };
    setResult({ cost, pkg, menu: menus[food] });
  };

  const lockPlan = () => {
    if (result) {
      localStorage.setItem("lockedPlan", JSON.stringify({
        ...result,
        eventType,
        guests,
        budget,
        foodPreference: food
      }));
      window.dispatchEvent(new Event("storage"));
      toast.success("Plan locked! Complete the form below to inquire.");
    }
  };

  return (
    <section id="planner" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="AI Concierge"
          title="Plan your event in seconds"
          subtitle="Tell us about your celebration. Our planner suggests the right package and menu instantly."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <motion.form
            onSubmit={compute}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass rounded-3xl p-8 shadow-elev"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15">
                <Wand2 className="h-5 w-5 text-gold" />
              </span>
              <h3 className="font-display text-2xl">Event Details</h3>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Event Type</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {eventTypes.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setEventType(t)}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        eventType === t ? "bg-gold text-primary-foreground" : "gold-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="flex justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Guests <span className="text-gold">{guests}</span>
                  </label>
                  <input
                    type="range" min={20} max={1000} step={10} value={guests}
                    onChange={(e) => setGuests(+e.target.value)}
                    className="mt-3 w-full accent-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Budget <span className="text-gold">₹{budget.toLocaleString()}</span>
                  </label>
                  <input
                    type="range" min={25000} max={1000000} step={5000} value={budget}
                    onChange={(e) => setBudget(+e.target.value)}
                    className="mt-3 w-full accent-[var(--gold)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Food Preference</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {foodTypes.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFood(t)}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        food === t ? "bg-gold text-primary-foreground" : "gold-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold transition-transform hover:scale-105"
              >
                <LockPlanIcon className="h-4 w-4" /> Generate My Plan
              </button>
            </div>
          </motion.form>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="r"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl p-8 h-full"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">Estimated Plan</p>
                  <p className="mt-3 font-display text-5xl gradient-text">₹{result.cost.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-muted-foreground">All-inclusive estimate · {guests} guests</p>

                  <div className="mt-6 rounded-2xl gold-border bg-background/40 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Suggested Package</p>
                    <p className="mt-1 font-display text-2xl">{result.pkg}</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Suggested Menu</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {result.menu.map((m) => (
                        <li key={m} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" />{m}</li>
                      ))}
                    </ul>
                  </div>

                  <a 
                    href="#contact" 
                    onClick={lockPlan}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    Lock this plan
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="e"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-3xl p-8 h-full flex flex-col justify-center text-center"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gold-border">
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>
                  <p className="mt-5 font-display text-2xl">Your plan appears here</p>
                  <p className="mt-2 text-sm text-muted-foreground">Fill out the form and we'll suggest a package, estimated cost and a menu tailored to your event.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const LockPlanIcon = Sparkles;
